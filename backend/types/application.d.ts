import mongoose from 'mongoose';

export interface IApplication extends mongoose.Document {
    job: mongoose.Schema.Types.ObjectId;
    applicant: mongoose.Schema.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
}
