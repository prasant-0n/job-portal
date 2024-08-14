import mongoose from 'mongoose';

export interface IProfile {
    bio?: string;
    skills?: string[];
    resume?: string; // URL to resume file
    resumeOriginalName?: string;
    company?: mongoose.Schema.Types.ObjectId;
    profilePhoto?: string;
}
