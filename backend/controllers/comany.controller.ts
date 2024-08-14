import { Request, Response } from 'express';
import Company from '../models/company.model';

export const registerCompany = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { companyName } = req.body;

        // Validate required fields
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if company already exists
        const existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "You can't register the same company twice.",
                success: false
            });
        }

        // Create new company
        const company = await Company.create({
            name: companyName,
            userId: req.id // Ensure req.id is set by authentication middleware
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
