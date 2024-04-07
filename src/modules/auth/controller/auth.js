import userModel from "../../../../DB/model/User.model.js";
import sendEmail from "../../../utils/SendEmail.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import optModel from "../../../../DB/model/Opt.model.js";
import { customAlphabet } from "nanoid";



export const signUp = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;

    if (await userModel.findOne({ email: email.toLowerCase() })) {
        return next(new Error("Email is Already Registered", { cause: 409 }))
    }

    // generate Token
    const token = generateToken({ payload: { email: email.toLowerCase() }, signature: process.env.TOKEN_EMAIL, expiresIn: 60 * 5 })
    const refreshToken = generateToken({ payload: { email: email.toLowerCase() }, signature: process.env.TOKEN_EMAIL, expiresIn: 60 * 60 * 24 * 30 })

    // links html
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/reqNewConfirmEmail/${refreshToken}`

    //template Email
    const html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                border: 0;
                box-sizing: border-box;
            }
        </style>
    </head>
    <body style="max-width: 600px; margin: auto; font-family: Arial, Helvetica, sans-serif;">
        <div class="wrapper">
            <header style="padding: 15px 20px 15px; background-color: #20c997;">
                <a href="#" target="_blank"
                    style="font-size: 32px; font-weight: bold; color: #fff; text-decoration: none;">
                    sarhani
                </a>
            </header>
            <div class="content" style="padding: 40px 0px;">
                <h1 style="font-size: 32px; margin-bottom: 20px;">Verify Your Email Address</h1>
                <p style="margin-bottom: 20px; font-size: 16px; color: #353740;">To continue setting up your sarhani
                    account, please verify that this is your email address.</p>
                <div style="margin-top: 32px;">
                    <a href="${link}"
                        style="padding: 20px 16px; background-color: #20c997; color: #fff; margin-top: 60px;text-decoration: none; border-radius: 5px;">Verify
                        Email Address</a>
                </div>
            </div>
            <p style="padding: 0px 0px 20px; font-size: 13px; color: #6e6e80;">This link will expire in 5 minutes. if you
                did not make this request, Click on this link to send another
                request <a href="${refreshLink}" style="text-decoration: underline !important; color: blue;">New Request</a></p>
        </div>
    </body>
    
    </html>`

    // Send Email
    if (!await sendEmail({ to: email, subject: "Authenticate Your Email Address", html })) {
        return next(new Error("Email Rejected", { cause: 400 }))
    }

    // create user & hashPassword
    const hashPassword = hash({ plaintext: password })
    const user = await userModel.create({ userName, email, password: hashPassword, provider: 'SYSTEM' })

    return res.status(201).json({ message: 'Done', _id: user._id })
})

export const confirmEmail = asyncHandler(async (req, res, next) => {

    const { email } = verifyToken({ token: req.params.token, signature: process.env.TOKEN_EMAIL })
    if (!email) {
        return next(new Error("In-Valid token payload", { cause: 400 }))
    }

    const user = await userModel.updateOne({ email }, { isVerifide: true })
    if (user.matchedCount) {
        return res.status(200).redirect(`${process.env.FT_URL}/login`)
    } else {
        return res.status(400).redirect(`${process.env.FT_URL}/notFound`)
    }
})

export const reqNewConfirmEmail = asyncHandler(async (req, res, next) => {

    const { email } = verifyToken({ token: req.params.token, signature: process.env.TOKEN_EMAIL })
    if (!email) {
        return next(new Error("In-Valid token payload", { cause: 400 }))
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error("Not register account", { cause: 400 }))
    }
    if (user.isVerifide) {
        return res.status(200).redirect(`${process.env.FT_URL}/login`)
    }

    // generate newToken
    const newToken = generateToken({ payload: { email: email.toLowerCase() }, signature: process.env.TOKEN_EMAIL, expiresIn: 60 * 5 })

    // links html
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/reqNewConfirmEmail/${req.params.token}`

    //template Email
    const html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                border: 0;
                box-sizing: border-box;
            }
        </style>
    </head>
    <body style="max-width: 600px; margin: auto; font-family: Arial, Helvetica, sans-serif;">
        <div class="wrapper">
            <header style="padding: 15px 20px 15px; background-color: #20c997;">
                <a href="#" target="_blank"
                    style="font-size: 32px; font-weight: bold; color: #fff; text-decoration: none;">
                    sarhani
                </a>
            </header>
            <div class="content" style="padding: 40px 0px;">
                <h1 style="font-size: 32px; margin-bottom: 20px;">Verify Your Email Address</h1>
                <p style="margin-bottom: 20px; font-size: 16px; color: #353740;">To continue setting up your sarhani
                    account, please verify that this is your email address.</p>
                <div style="margin-top: 32px;">
                    <a href="${link}"
                        style="padding: 20px 16px; background-color: #20c997; color: #fff; margin-top: 60px;text-decoration: none; border-radius: 5px;">Verify
                        Email Address</a>
                </div>
            </div>
            <p style="padding: 0px 0px 20px; font-size: 13px; color: #6e6e80;">This link will expire in 5 minutes. if you
                did not make this request, Click on this link to send another
                request <a href="${refreshLink}" style="text-decoration: underline !important; color: blue;">New Request</a></p>
        </div>
    </body>
    
    </html>`

    // Send Email
    if (!await sendEmail({ to: email, subject: "Authenticate Your Email Address", html })) {
        return next(new Error("Email Rejected", { cause: 400 }))
    }

    return res.status(200).json({message:'Done'})
})

export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error("In-Valid email or password", { cause: 404 }))
    }

    if (!user.isVerifide) {
        return next(new Error("Please check your email first to confirm your email", { cause: 400 }))
    }

    if (!compare({ plaintext: password, hashValue: user.password })) {
        return next(new Error("In-Valid email or password", { cause: 400 }))
    }

    //delete opt code 
    await optModel.findOneAndDelete({ email: user.email })

    const token = generateToken({ payload: { id: user._id, isLogin: true }, expiresIn: 60 * 60 * 24 * 30 })
    return res.status(200).json({ message: 'Done', token })
})


export const sendCode = asyncHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email.toLowerCase() })
    if (!user) {
        return next(new Error("In-Valid Email", { cause: 400 }));
    }
    //genetate random code
    const nanoid = customAlphabet('0123456789', 5)
    const createCode = await optModel.create({
        email: user.email,
        code: nanoid(),
        expireIn: new Date().getTime() + 300 * 1000
    });

    const html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                border: 0;
                box-sizing: border-box;
            }
        </style>
    </head>
    <body style="max-width: 600px; margin: auto; font-family: Arial, Helvetica, sans-serif;">
        <div class="wrapper">
            <header style="padding: 15px 20px 15px; background-color: #20c997;">
                <a href="#" target="_blank"
                    style="font-size: 32px; font-weight: bold; color: #fff; text-decoration: none;">
                    sarhani
                </a>
            </header>
            <div class="content" style="padding: 40px 20px;">
                <h1 style="font-size: 16px; margin-bottom: 20px;">Security Code:</h1>
                <h3 style="margin: 0px 0px 20px; font-size: 24px;">${createCode.code}</h3>
                <p style="margin-bottom: 20px; font-size: 12px; color: #353740;">if you did't request this code, please go to your Account page and change your password right away</p>
            </div>
            <p style="padding: 0px 20px 20px; font-size: 13px; color: #6e6e80; text-align: center;"> <a href="#" style="text-decoration: underline !important;">StickyNote.Com</a></p>
        </div>
    </body>
    
    </html>`

    if (!await sendEmail({ to: user.email, subject: "Reset password", html })) {
        return next(new Error("Email Rejected", { cause: 400 }))
    }
    const token = generateToken({ payload: { email: user.email }, signature: process.env.TOKEN_EMAIL, expiresIn: 60 * 5 })

    return res.status(201).json({ message: "Success", token });
})

export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = verifyToken({ token: req.params.token ,signature:process.env.TOKEN_EMAIL})
    const { code, newPassword } = req.body;

    const check = await optModel.findOne({ email: email, code: code })
    if (!check || check?.code != code) {
        return next(new Error("In-Valid Code", { cause: 400 }));
    }

    const currentTime = new Date().getTime()
    if (check.expireIn - currentTime < 0) {
        return next(new Error("The code is expired", { cause: 400 }));
    }

    const hashPassword = hash({ plaintext: newPassword })
    await userModel.findOneAndUpdate({ email: check.email }, { password: hashPassword });
    await optModel.findByIdAndDelete(check._id)
    return res.status(200).json({ message: "Done" });
});


