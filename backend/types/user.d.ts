import { Document } from 'mongoose';
import { IProfile } from './profile';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; // Explicitly specify the type of _id
    fullname: string;
    email: string;
    phoneNumber: number;
    password: string;
    role: 'student' | 'recruiter';
    profile: IProfile;
}
