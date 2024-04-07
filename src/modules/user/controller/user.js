import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).select("userName profilePicture")
    return res.status(200).json({ message: 'Done', results: user })
})


export const uploadPicture = asyncHandler(async (req, res, next) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/${req.user._id}/profile` })
    const user = await userModel.findByIdAndUpdate(req.user._id, { profilePicture: { secure_url, public_id } })
    await cloudinary.uploader.destroy(user.profilePicture.public_id)
    return res.status(200).json({ message: 'Done', user })
})

export const shareProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.userId).select("userName profilePicture");
    return user ? res.status(200).json({ message: "Done" , results:user}) : next(new Error("In-Valid Account Id", { cause: 400 }))
})