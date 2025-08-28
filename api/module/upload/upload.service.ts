import { Injectable, BadRequestException, Inject, forwardRef, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { MulterS3File } from './utils/multe.s3.file';
import { SuccessResponse } from '../../utils/success.response';
import {
    S3Client,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from './utils/multer.config'
@Injectable()
export class UploadService {
  
    constructor() { }

    private generateFileUrl(file: MulterS3File): string {
        if (file.location) return file.location;
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        return `${baseUrl}/uploads/${file.filename}`; 
    }

    async handleUpload(file: MulterS3File, type: string) {
        if (!file) throw new BadRequestException('No file uploaded');

        const fileUrl = this.generateFileUrl(file);

        return new SuccessResponse({
            message: `${type} image uploaded successfully`,
            metadata: {
                url: fileUrl,
                key: file.key || file.filename,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                bucket: file.bucket || 'local',
            },
        });
    }





   


    async createMultipartUpload(fileName: string, contentType: string) {
        const command = new CreateMultipartUploadCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `uploads/${Date.now()}-${fileName}`,
            ContentType: contentType,
          //  ACL: 'public-read'
        });

        const result = await s3.send(command);
        return {
            uploadId: result.UploadId!,
            key: result.Key!,
        };
    }

    async getPresignedUrl(uploadId: string, key: string, partNumber: number): Promise<string> {
        const command = new UploadPartCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            PartNumber: partNumber,
            UploadId: uploadId,
        });

        return await getSignedUrl(s3, command, { expiresIn: 3600 });
    }


    async completeMultipartUpload(key: string, uploadId: string, parts: { ETag: string; PartNumber: number }[]) {
        const command = new CompleteMultipartUploadCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        });

        const result = await s3.send(command);
        return result.Location;

    }
     async abortMultipartUpload(key: string, uploadId: string) {
          const command = new AbortMultipartUploadCommand({
               Bucket: process.env.AWS_BUCKET_NAME!,
               Key: key,
               UploadId: uploadId,
          });
          return s3.send(command);
     }
     async deleteObject(key: string) {
          const command = new DeleteObjectCommand({
               Bucket: process.env.AWS_BUCKET_NAME!,
               Key: key,
          });
          return s3.send(command);
     }


}
