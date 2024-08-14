import jwt, { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';

// Define the type for the payload
interface TokenPayload {
    userId: string;
}

export const generateTokenAndCookies = (res: Response, userId: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const options: SignOptions = {
        expiresIn: "7d", // Token expiration time
    };

    // Generate the token
    const token = jwt.sign({ userId }, secret, options);

    // Set the cookie in the response
    res.cookie("token", token, {
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "strict", // Restrict sending the cookie in cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return token;
};
