import mongoose from 'mongoose';
import { IApplication } from '../types/application';

const applicationSchema = new mongoose.Schema<IApplication>({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Application = mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
