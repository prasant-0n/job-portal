import express, { Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import { singleUpload } from "../middleware/multer";
import {
    getCompany,
    getCompanyById,
    registerCompany,
    updateCompany,
} from "../controllers/company.controller";

const router = express.Router();

interface AuthenticatedRequest extends Request {
    user?: any;
}

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

export default router;
