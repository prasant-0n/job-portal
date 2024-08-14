import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IRequestWithFile } from '../types/express';

// Define the type for the decoded JWT payload
interface JwtPayload {
    userId: string;
}

// Extend the Request interface to include userId

const isAuthenticated = async (req: IRequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        // Check if token is provided
        if (!token) {
            res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
            return; // Ensure function exits after sending response
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;

        // Check if token is valid
        if (!decoded) {
            res.status(401).json({
                message: "Invalid token",
                success: false,
            });
            return; // Ensure function exits after sending response
        }

        // Attach userId to request object
        req.id = decoded.userId;
        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(401).json({
            message: "Authentication failed",
            success: false,
        });
    }
};

export default isAuthenticated;
