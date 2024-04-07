import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import userRouter from './modules/user/user.router.js'
import messageRouter from './modules/messages/message.router.js'



import { gloablErrorHandling } from './utils/errorHandling.js'


const initApp = (app, express) => {

    //convert Buffer Data
    app.use(express.json({}))

    //Setup API Routing 
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/message', messageRouter)


    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })

    // Gloable Error Handling
    app.use(gloablErrorHandling)
    // Connected DB
    connectDB()

}




export default initApp