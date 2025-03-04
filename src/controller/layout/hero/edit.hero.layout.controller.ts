import { Response } from "express";
import asyncHandler from 'express-async-handler';
import { IUserMessage } from "../../../middleware/authJWT";
import layoutModel from "../../../model/layout.model";
import NotFoundError from "../../../errors/notFound.errors";
import { loop } from "../../../utils/help";
import { uploadFileToSpaces } from "../../../config/spaces";




export const updateHero = asyncHandler(async (req: IUserMessage, res: Response) => {
    // Check if there is a layout document
    console.log(req.files)
    let layout = await layoutModel.findOne();
    if (!layout) throw new NotFoundError('Layout not found')
    const body = { ...req.body } as any
    if (req?.file) {
        const url = await uploadFileToSpaces(req.file);
        body.photo = {
            public_id: url.Key,
            url: url.Location
        };
    }
    console.log({ body })
    layout.hero.photo = body?.photo?.url ? body.photo : layout.hero.photo;
    layout.hero.subTitle = body.subTitle ? body.subTitle : layout.hero.subTitle;
    layout.hero.title = body.title ? body.title : layout.hero.title;
    await layout.save();
    res.json({
        success: true,
        data: layout
    });


})
