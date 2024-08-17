import { Request, Response } from 'express';
import Company from '../models/company.model';
import { UpdateRequest } from '../types/express';
import getDataUri from '../utils/dataUri';
import cloudinary from '../utils/cloudinary';

interface CustomRequest extends Request {
    id?: string; // Custom property added by the middleware
}


export const registerCompany = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
            userId: req.id // Use the custom property from the middleware
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error('Error during company registration:', error);
        return res.status(500).json({
            message: "An error occurred while registering the company.",
            success: false
        });
    }
};

export const getCompany = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.id; // logged-in user id

        // Find companies based on the logged-in user's id
        const companies = await Company.find({ userId });

        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        return res.status(500).json({
            message: "An error occurred while fetching companies.",
            success: false
        });
    }
};


export const getCompanyById = async (req: UpdateRequest, res: Response): Promise<Response> => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error('Error fetching company by ID:', error);
        return res.status(500).json({
            message: "An error occurred while fetching the company.",
            success: false
        });
    }
};


export const updateCompany = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const { name, description, website, location } = req.body;

        let logo: string | undefined;

        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true,
            company,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating the company information.",
            success: false,
        });
    }
};


