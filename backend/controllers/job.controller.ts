import { Request, Response } from 'express';
import Job from '../models/jobs.model';
import { AdminRequest } from '../types/customerRequest';

// Define a custom request interface
interface PostJobRequest extends Request {
    body: {
        title: string;
        description: string;
        requirements: string;
        salary: string;
        location: string;
        jobType: string;
        experience: string;
        position: string;
        companyId: string;
    };
    id?: string; // userId set by authentication middleware
}

// Interface for getAllJobs
export interface JobQueryRequest extends Request {
    query: {
        keyword?: string;
    };
}

// Interface for getJobById
export interface JobIdRequest extends Request {
    params: {
        id: string;
    };
}

// Interface for requests with an id property
// export interface AdminRequest extends Request {
//     id: string;
// }


export const postJob = async (req: PostJobRequest, res: Response): Promise<Response> => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


export const getAllJobs = async (req: JobQueryRequest, res: Response): Promise<Response> => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


export const getJobById = async (req: JobIdRequest, res: Response): Promise<Response> => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications",
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAdminJobs = async (req: AdminRequest, res: Response): Promise<Response> => {
    try {
        const adminId = req.id; // This should be of type `string` or handle the possibility of `undefined`
        if (!adminId) {
            return res.status(401).json({
                message: "Admin ID not found",
                success: false
            });
        }

        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            options: { sort: { createdAt: -1 } }
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};