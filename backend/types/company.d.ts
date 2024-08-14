import mongoose from 'mongoose';

export interface ICompany extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description?: string; // Optional field
    website?: string; // Optional field
    location?: string; // Optional field
    logo?: string; // Optional field (URL to company logo)
    userId: mongoose.Schema.Types.ObjectId;
}
