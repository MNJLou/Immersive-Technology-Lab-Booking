import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    studentNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    yearOfStudy: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true}
);

const User = models.User || mongoose.model('User', userSchema);
export default User;