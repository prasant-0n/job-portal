import { Request } from 'express';

export interface CustomRequest extends Request {
    id?: string; // User ID added by authentication middleware
    params: {
        id: string; // Job ID from the request parameters
    };


}



//user

export interface IUpdateProfileRequest extends Request {
    file?: Express.Multer.File;
    userId?: string;
}

export interface IRequestWithFile extends Request {
    file?: Express.Multer.File; // Add file property if using file 
    userId?: string; // Optional userId property from middleware
    id?: string;
}



//company




//jobs



//application



