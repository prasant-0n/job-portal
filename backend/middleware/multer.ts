import multer, { StorageEngine } from 'multer';
import { RequestHandler } from 'express';

// Define the storage configuration
const storage: StorageEngine = multer.memoryStorage();

// Create the multer instance with the defined storage and specify that we're handling single file uploads
export const singleUpload: RequestHandler = multer({ storage }).single('file');
