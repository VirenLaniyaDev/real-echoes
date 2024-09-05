import mongoose, { Schema, Document } from "mongoose";

//#region Message
export interface Message extends Document {
    content: string,
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema<Message>({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});
//#endregion

//#region User
export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean,
    isVerified: boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter valid email!"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        select: false
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code required!"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required!"]
    },
    isVerified:  {
        type: Boolean,
        default: false
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

//#endregion

export default UserModel;
