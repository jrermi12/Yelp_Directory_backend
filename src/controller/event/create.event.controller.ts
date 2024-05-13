import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IUserMessage } from '../../middleware/authJWT';
import { loop } from '../../utils/help';
import Event from '../../model/event.model';
import { createEventInput } from '../../utils/validation/event.validation';
// import { uploadFile } from '../../config/spaces'; // Adjust the path accordingly
// import { local_config } from "../../config/config"


//@desc create  event
//@method POST  /event
//@access private
const createEvent = asyncHandler(async (req: IUserMessage<{}, {}, createEventInput>, res: Response) => {
    const body = { ...req.body } as any
    console.log(req?.files)
    if (req?.files && req?.files.length) {
        const url = await loop(req?.files)
        body.photo = {
            public_id: url.id,
            url: url.url
        }

        // const fileName = req.file.filename;
        // const id = generateUniqueID(); // Generate a unique public ID for the file
        // await uploadFile(fileName); // Upload file to DigitalOcean Spaces
        // body.photo = {
        //     public_id: id, // Save the public ID in the database
        //     url: `${local_config.BUCKET_URL}/${fileName}` // Construct the file URL
        // };
    }
    console.log({ body })
    body.price = parseFloat(body?.price)
    body.date = new Date(body?.date)
    const response = await Event.create(body)
    res.status(201).json({
        message: 'Event created sucessfully',
        data: response,
        success: true
    });
})
export { createEvent };


