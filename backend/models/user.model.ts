import mongoose from 'mongoose';
import { IProfile } from '../types/profile';
import { IUser } from '../types/user';

const profileSchema = new mongoose.Schema<IProfile>({
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String },
    resumeOriginalName: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    profilePhoto: { type: String, default: "" }
}, { _id: false });


const userSchema = new mongoose.Schema<IUser>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        type: profileSchema,
        default: {}
    }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
