import { Request, Response } from 'express';
import { Multer } from 'multer'; // Import Multer types for file handling

// Define a custom interface for the request object with file
export interface IRequestWithFile extends Request {
    file?: Express.Multer.File; // Add file property if using file 
    userId?: string; // Optional userId property from middleware
    id?: string;
}

