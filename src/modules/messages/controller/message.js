import messageModel from "../../../../DB/model/Message.model.js";
import userModel from "../../../../DB/model/User.model.js";
import sendEmail from "../../../utils/SendEmail.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getAllMessage = asyncHandler(async (req, res, next) => {
    const messages = await messageModel.find({ receiverId: req.user._id }).select("text")
    return res.status(200).json({ message: "Done", results: messages })
})

export const sendMessage = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.receiverId)
    if (!user) {
        return next(new Error("In-Valid Account Id", { cause: 404 }))
    }

    const createMessage = await messageModel.create({ text: req.body.text, receiverId: user._id })

    const html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>sarheni</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                border: 0;
                box-sizing: border-box;
            }
    
            body {
                max-width: 600px;
                min-height: 800px;
                margin: auto;
            }
            .wrapper {
                padding-bottom: 20px;
                background-color: #F8F9FA;
            }
    
            header {
                padding: 15px 20px;
                background-color: #20c997;
            }
    
            a {
                color: #fff;
                text-decoration: none;
            }
    
            .message {
                padding: 10px 20px 20px;
            }
    
            .message img {
                max-width: 60px;
                max-height: 40px;
                border-radius: 50%;
            }
    
            .message .unknown {
                display: flex;
                align-items: center;
            }
    
            .message .unknown span {
                font-weight: bold;
            }
    
            .message p {
                margin: 15px 36px 0px;
                color: #4c4d4d;
            }
    
            footer {
                font-size: 12px;
                text-align: center;
                border-top: 1px solid #ddd;
            }
            footer p {
                padding-top: 10px;
                color: #252b33;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <header>
                <a target="_blank" href="#">
                    <h1>sarheni</h1>
                </a>
            </header>
            <div class="message">
                <div class="unknown">
                    <img src="User-avatar.svg.png" alt="" style="background-color: #ddd;">
                    <span style="padding-left: 10px;">unknown</span>
                </div>
                <p>${createMessage.text}</p>
            </div>
            <footer>
                <p>Copyright Â© 2023 sarheni. All Rights Reserved</p>
            </footer>
        </div>
    </body>
    </html>`

    // Send Email
    if (!await sendEmail({ to: user.email, subject: "Unknow", html })) {
        return next(new Error("Email Rejected", { cause: 400 }))
    }

    return res.status(201).json({ message: "Done", results: createMessage })
})

export const deleteMessage = asyncHandler(async (req, res, next) => {
    const { messageId } = req.params
    const message = await messageModel.deleteOne({ _id: messageId, receiverId: req.user._id })
    return message.deletedCount ? res.status(200).json({ message: "Done" }) : next(new Error("In-Valid Message Id", { cause: 404 }))
})