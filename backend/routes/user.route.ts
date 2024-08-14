import express from 'express';
import { singleUpload } from '../middleware/multer';
import { login, logout, register, updateProfile } from '../controllers/user.controller';
import isAuthenticated from '../middleware/isAuthenticated';
// Corrected import path

const router = express.Router();

// Registration route with file upload
router.post('/register', singleUpload, register);

// Login route without file upload
router.post('/login', login);

// Logout route (typically POST for security reasons)
router.post('/logout', logout);

// Profile update route with authentication and file upload
router.post('/profile/update', isAuthenticated, singleUpload, updateProfile);

export default router;
