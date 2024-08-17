import express from 'express';
import { singleUpload } from '../middleware/multer';
import { login, logout, register, updateProfile } from '../controllers/user.controller';
import isAuthenticated from '../middleware/isAuthenticated';

const router = express.Router();

router.post('/register', singleUpload, register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/profile/update', isAuthenticated, singleUpload, updateProfile);

export default router;
