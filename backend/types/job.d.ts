import mongoose from 'mongoose';

export interface IJob extends mongoose.Document {
    title: string;
    description: string;
    requirements: string[];
    salary: number;
    experienceLevel: number;
    location: string;
    jobType: string;
    position: number;
    company: mongoose.Schema.Types.ObjectId;
    created_by: mongoose.Schema.Types.ObjectId;
    applications: mongoose.Schema.Types.ObjectId[];
}
