import joi from 'joi'
import { generalFields } from "../../middleware/validation.js";


export const uploadProfilePic = joi.object({
    file: generalFields.file.required()
}).required()
export const shareProfile = joi.object({
    userId: generalFields.id
}).required()