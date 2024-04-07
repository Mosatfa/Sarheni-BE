import userModel from "../../DB/model/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../utils/errorHandling.js";



const auth = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
        return next(new Error(`In-valid Bearer Key`, { cause: 400 }))
    }

    const token = authorization.split(process.env.BEARER_KEY)[1]
    if (!token) {
        return next(new Error(`In-valid Token`, { cause: 400 }))
    }

    const decoded = verifyToken({ token })
    if (!decoded?.id) {
        return next(new Error(`In-valid Token Payload`, { cause: 400 }))
    }

    const user = await userModel.findById(decoded.id).select("userName")
    if (!user) {
        return next(new Error(`Not Register Account`, { cause: 401 }))
    }

    req.user = user;

    return next()
})

export default auth

