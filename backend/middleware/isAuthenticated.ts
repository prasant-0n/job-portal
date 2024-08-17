import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomRequest } from '../types/customerRequest';

const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;

        if (!decoded || !decoded.userId) {
            res.status(401).json({
                message: "Invalid token",
                success: false,
            });
            return;
        }

        req.id = decoded.userId; // Ensure req.id is set
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
