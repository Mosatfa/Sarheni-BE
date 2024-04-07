import joi from 'joi'
import { generalFields } from "../../middleware/validation.js";

export const signUp = joi.object({
    userName: joi.string().min(2).max(150).required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref('password'))
}).required()

export const token = joi.object({
    token: joi.string().required()
}).required()

export const login = joi.object({
    email: generalFields.email,
    password: generalFields.password,
}).required()

export const sendCode = joi.object({
    email: generalFields.email,
}).required()

export const forgetPassword = joi.object({
    token: joi.string().required(),
    code: joi.string().min(5).max(5).required(),
    newPassword: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref('newPassword'))
}).required()