import { Request } from 'express';
import { Multer } from 'multer'; // Import Multer types for file handling

// Define a custom interface for the request object with file


export interface UpdateRequest extends Request {
    file?: Express.Multer.File; // Optional file property
    params: {
        id: string; // companyId from the request parameters
    };
    body: {
        name?: string;
        description?: string;
        website?: string;
        location?: string;
    };
}


declare global {
    namespace Express {
        interface Request {
            id?: string; // Add other custom properties as needed
        }
    }
}