import { Request, Response } from 'express';


export interface IUpdateProfileRequest extends Request {
    file?: Express.Multer.File;
    userId?: string;
}

export interface IRequestWithFile extends Request {
    file?: Express.Multer.File; // Add file property if using file 
    userId?: string; // Optional userId property from middleware
    id?: string;
}