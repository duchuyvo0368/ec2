import multerS3 from 'multer-s3';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();



if (!process.env.AWS_BUCKET_NAME) {
    throw new Error('[UPLOAD][FATAL] AWS_BUCKET_NAME is missing in environment variables. Please set it in your .env file.');
}

if (!process.env.AWS_REGION) {
    throw new Error('[UPLOAD][FATAL] AWS_REGION is missing in environment variables. Please set it in your .env file.');
}

if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('[UPLOAD][FATAL] AWS_ACCESS_KEY is missing in environment variables. Please set it in your .env file.');
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('[UPLOAD][FATAL] AWS_SECRET_KEY is missing in environment variables. Please set it in your .env file.');
}


export const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
        'video/quicktime',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images are allowed'));
};

export const uploadConfig = {
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        // acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            const filename = `uploads/${timestamp}-${Math.random().toString(36).slice(2)}${ext}`;
            cb(null, filename);
        },
    }),
    limits: {
        fileSize: 50*1024 * 1024, // 5MB
    },
    fileFilter,
};


