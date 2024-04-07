import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const sendMessage = joi.object({
    receiverId : generalFields.id,
    text: joi.string().min(1).required(),
}).required()

export const deleteMessage = joi.object({
    messageId : generalFields.id
}).required()

// lang: joi.string().min(2).max(2).required(),