import { Request, Response } from "express";
import { activateUserInput } from "../../utils/validation/auth.validation";
import userModel from "../../model/user.model";
import BadRequestError from "../../errors/badRequest.errors";
import asyncHandler from 'express-async-handler';
import { findUser } from "../../utils/db_functions/user.db";

//@desc  avtivate email
//@method POST  /auth/activate
//@access public
export const activateUser = asyncHandler(async (req: Request<{}, {}, activateUserInput>, res: Response) => {
    const { email, verificationCode } = req.body

    const userExists = await findUser({ email }, { select: "+password +verificationCode +verificationCodeExpires" })

    if (!userExists) throw new BadRequestError('User doesnt exist')
    if (userExists.isActive) throw new BadRequestError('User has already verified')
    if (userExists.verificationCode != verificationCode || userExists.verificationCodeExpires < Date.now())
        throw new BadRequestError('Invalid code')
    userExists.verificationCode = ""
    userExists.verificationCodeExpires = Date.now()
    userExists.isActive = true
    await userExists.save()
    res.status(201).json({ message: 'user verified sucessfully', success: true })

}) 