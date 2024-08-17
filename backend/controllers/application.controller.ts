import { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import Application from '../models/application.model';
import Job from '../models/jobs.model';

export interface CustomRequest extends Request {
    id?: string; // User ID added by authentication middleware
    params: {
        id: string; // Job ID from the request parameters
    };
}

export const applyJob = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false,
            });
        }

        // Convert jobId to ObjectId if necessary
        const jobObjectId = new mongoose.Types.ObjectId(jobId);

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({
            job: jobObjectId,
            applicant: new mongoose.Types.ObjectId(userId),
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false,
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobObjectId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false,
            });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobObjectId,
            applicant: new mongoose.Types.ObjectId(userId),
        });

        // Add the application to the job's applications array
        await Job.updateOne(
            { _id: jobObjectId },
            { $addToSet: { applications: newApplication._id } }
        );

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while applying for the job.",
            success: false,
        });
    }
};


export const getAppliedJobs = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.id;

        // Ensure userId is defined
        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false,
            });
        }

        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } },
                },
            });

        if (!applications || applications.length === 0) {
            return res.status(404).json({
                message: "No applications found.",
                success: false,
            });
        }

        return res.status(200).json({
            applications,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while fetching the applied jobs.",
            success: false,
        });
    }
};


export const getApplicants = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const jobId = req.params.id;

        // Ensure jobId is defined
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false,
            });
        }

        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
            },
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false,
            });
        }

        return res.status(200).json({
            job,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while fetching the applicants.",
            success: false,
        });
    }
};

export const updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }

        // Find the application by id
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: 'Application not found.',
                success: false
            });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: 'Status updated successfully.',
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
}