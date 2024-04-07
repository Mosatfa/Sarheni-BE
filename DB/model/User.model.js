import mongoose, { Schema, model } from 'mongoose'

const userSchema = new Schema({
    profilePicture: Object,
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerifide: {
        type: Boolean,
        default: false
    },
    provider: {
        type: String,
        default: 'SYSTEM',
        enum: ['SYSTEM', 'GOOGLE']
    }
}, {
    timestamps: true
})

const userModel = mongoose.models.User || model('User', userSchema)

export default userModel