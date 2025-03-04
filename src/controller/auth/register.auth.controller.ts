import { Request, Response } from "express";
import { registerUserInput } from "../../utils/validation/auth.validation";
import userModel from "../../model/user.model";
import BadRequestError from "../../errors/badRequest.errors";
import bcrypt from 'bcryptjs'
import { generateRandom4DigitString, generateRandomNumber } from "../../utils/util";
import { sendMail } from "../../utils/sendMail";
import asyncHandler from 'express-async-handler';
import { createUser, findUserByEmail } from "../../utils/db_functions/user.db";
import { local_config } from "../../config/config";

//@desc signup
//@method POST  /auth/signup
//@access public
export const registerUser = asyncHandler(async (req: Request<{}, {}, registerUserInput>, res: Response) => {
    const { email, password } = req.body
    const userExists = await findUserByEmail(email)

    if (userExists) throw new BadRequestError('User exists with this credential')
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    // const code = generateRandom4DigitString()
    const code = generateRandomNumber(6)
    const verificationExpires = parseInt(local_config.VERIFICATION_CODE_EXP ?? "30") * 1000 * 60
    const response = await createUser({
        ...req.body,
        password: hashPassword,
        verificationCode: code,
        verificationCodeExpires: Date.now() + verificationExpires,
    })
    await sendMail({
        email: email,
        subject: "Email verification",
        template: "emailVerification.mails.ejs",
        data: {
            user: req.body.firstName,
            code,
        },
    });

    res.status(201).json({ success: true, message: 'Verification email sent' })


}) 