import DataUriParser from 'datauri/parser.js';
import path from 'path';
import { Express } from 'express';

// Define the type for the file object
interface IFile {
    buffer: Buffer;
    originalname: string;
}

// Convert function to TypeScript
const getDataUri = (file: IFile): { content: string } => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    const dataUri = parser.format(extName, file.buffer);

    // Ensure content is always a string
    if (!dataUri.content) {
        throw new Error('Failed to get data URI content.');
    }

    return { content: dataUri.content };
}

export default getDataUri;
