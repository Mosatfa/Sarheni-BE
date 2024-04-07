import * as userController from './controller/user.js'
import * as validitors from "./user.validation.js"
import auth from '../../middleware/auth.js'
import { fileUpload, fileValidation } from '../../utils/multer.js'
import { validation } from '../../middleware/validation.js'
import { Router } from 'express'

const router = Router()

router.get('/',
    auth,
    userController.getProfile
)
router.put('/upload',
    auth,
    fileUpload(fileValidation.image).single('image'),
    validation(validitors.uploadProfilePic),
    userController.uploadPicture
)

router.get('/:userId/profile',
    validation(validitors.shareProfile),
    userController.shareProfile
)




export default router