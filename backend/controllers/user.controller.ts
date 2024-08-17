import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



import User from '../models/user.model'; // Adjust path as needed
import getDataUri from '../utils/dataUri';
import cloudinary from '../utils/cloudinary';
import { generateTokenAndCookies } from '../utils/generateTokenAndCookies';
import { IRequestWithFile, IUpdateProfileRequest } from '../types/user/user.customRequest';



const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);




export const register = async (req: IRequestWithFile, res: Response): Promise<Response> => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Validate required fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Handle file upload if present
        const file = req.file;
        let profilePhotoUrl = "";
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse: any = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });

        // Generate token and set cookies
        generateTokenAndCookies(res, newUser._id.toString()); // Use newUser._id

        const { password: _, ...userResponse } = newUser.toObject(); // Remove password field

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            User: userResponse
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            message: "An error occurred during registration.",
            success: false
        });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
        return res.status(400).json({
            message: "All fields are required.",
            success: false
        });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // Compare provided password with stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // Check if the role matches
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with the specified role.",
                success: false
            });
        }

        // Generate JWT token
        const tokenData = { userId: user._id.toString() };
        const token = jwt.sign(tokenData, SECRET_KEY, { expiresIn: '1d' });

        // Prepare user data for response
        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        // Set token in cookies
        return res.status(200).cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).json({
            message: `Welcome back ${userResponse.fullname}`,
            user: userResponse,
            success: true
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            message: "An error occurred during login.",
            success: false
        });
    }
};


export const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Clear the token cookie by setting maxAge to 0
        return res.status(200).cookie("token", "", {
            maxAge: 0, // Expire the cookie immediately
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure flag in production
            sameSite: 'strict'
        }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({
            message: "An error occurred during logout.",
            success: false
        });
    }
};


export const updateProfile = async (req: IUpdateProfileRequest, res: Response): Promise<Response> => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const userId = req.userId; // Ensure this comes from authentication middleware

        // Validate userId and retrieve user
        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Update user details
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(","); // Convert comma-separated string to array

        // Handle file upload if present
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.resume = cloudResponse.secure_url; // Save Cloudinary URL
            user.profile.resumeOriginalName = file.originalname; // Save original file name
        }

        // Save updated user
        await user.save();

        // Return updated user details
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false
        });
    }
};
