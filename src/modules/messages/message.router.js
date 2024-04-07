import * as messageController  from './controller/message.js'
import * as validitors from "./message.validtion.js"
import auth from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
import { Router } from 'express'

const router = Router()

router.get('/',
    auth,
    messageController.getAllMessage
)
router.post('/:receiverId',
    validation(validitors.sendMessage),
    messageController.sendMessage
)
router.delete('/:messageId/delete',
    auth,
    validation(validitors.deleteMessage),
    messageController.deleteMessage
)

export default router