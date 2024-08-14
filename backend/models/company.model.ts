import mongoose from 'mongoose';
import { ICompany } from '../types/company';

const companySchema = new mongoose.Schema<ICompany>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    logo: {
        type: String // URL to company logo
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Company = mongoose.model<ICompany>('Company', companySchema);

export default Company;
