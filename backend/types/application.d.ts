import mongoose from 'mongoose';

export interface IApplication extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    job: mongoose.Schema.Types.ObjectId; // Use Schema.Types.ObjectId for schema field types
    applicant: mongoose.Schema.Types.ObjectId; // Use Schema.Types.ObjectId for schema field types
    status: 'pending' | 'accepted' | 'rejected';
}
