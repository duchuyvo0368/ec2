
import {
     Controller,
     Post,
     Get,
     Body,
     Query,
     UploadedFile,
     UseInterceptors,
     BadRequestException,
     Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import axios from 'axios';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
     constructor(private readonly uploadService: UploadService) { }

     @Post('create-multipart')
     @ApiOperation({ summary: 'Create a multipart upload session' })
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    fileName: { type: 'string', example: 'my-video.mp4' },
                    contentType: { type: 'string', example: 'video/mp4' },
               },
               required: ['fileName', 'contentType'],
          },
     })
     async createMultipart(
          @Body() body: { fileName: string; contentType: string },
     ) {
          return this.uploadService.createMultipartUpload(
               body.fileName,
               body.contentType,
          );
     }

     @Get('presigned-url')
     @ApiOperation({ summary: 'Get a presigned URL to upload a specific part' })
     @ApiQuery({ name: 'uploadId', type: String, required: true })
     @ApiQuery({ name: 'key', type: String, required: true })
     @ApiQuery({ name: 'partNumber', type: String, required: true, example: '1' })
     async getPresignedUrl(
          @Query('uploadId') uploadId: string,
          @Query('key') key: string,
          @Query('partNumber') partNumber: string,
     ) {
          return {
               url: await this.uploadService.getPresignedUrl(
                    uploadId,
                    key,
                    parseInt(partNumber),
               ),
          };
     }

     @Post('upload-part')
     @ApiConsumes('multipart/form-data')
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    presignedUrl: { type: 'string' },
                    partNumber: { type: 'number', example: 1 },
                    file: { type: 'string', format: 'binary' },
               },
               required: ['presignedUrl', 'partNumber', 'file'],
          },
     })
     @UseInterceptors(FileInterceptor('file'))
     async uploadPart(
          @Body() body: { presignedUrl: string; partNumber: number },
          @UploadedFile() file: Express.Multer.File,
     ) {
          if (!body.presignedUrl) throw new BadRequestException('Missing presignedUrl');
          if (!file) throw new BadRequestException('Missing file');
          if (!body.partNumber) throw new BadRequestException('Missing partNumber');

          const chunk = file.buffer;
          const url = body.presignedUrl;

          const uploadRes = await fetch(url, {
               method: 'PUT',
               headers: { 'Content-Type': file.mimetype },
               body: chunk as any,
          });

          if (!uploadRes.ok) {
               throw new Error(`Failed to upload part ${body.partNumber}: ${uploadRes.statusText}`);
          }

          const eTag = uploadRes.headers.get('etag');
          console.log(`Uploaded part ${body.partNumber}, ETag: ${eTag}`);

          return {
               ETag: eTag,
               PartNumber: body.partNumber,
          };
     }





     @Post('complete-multipart')
     @ApiOperation({ summary: 'Complete the multipart upload' })
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    key: { type: 'string', example: 'uploads/my-video.mp4' },
                    uploadId: { type: 'string', example: 'ABC123UPLOADID' },
                    parts: {
                         type: 'array',
                         items: {
                              type: 'object',
                              properties: {
                                   ETag: { type: 'string', example: "\"4ff12b4cab258bb7ebe1343214100797\"" },
                                   PartNumber: { type: 'number', example: 1 },
                              },
                              required: ['ETag', 'PartNumber'],
                         },
                    },
               },
               required: ['key', 'uploadId', 'parts'],
          },
     })
     async complete(
          @Body()
          body: { key: string; uploadId: string; parts: { ETag: string; PartNumber: number }[] },
     ) {
          console.log("logger:", body);
          return {
               location: await this.uploadService.completeMultipartUpload(
                    body.key,
                    body.uploadId,
                    body.parts,
               ),
          };
     }
     @Post('abort-multipart')
     async abort(
          @Body() body: { key: string; uploadId: string },
     ) {
          return this.uploadService.abortMultipartUpload(body.key, body.uploadId);
     }

     @Delete('object')
     async deleteObject(@Query('key') key: string) {
          return this.uploadService.deleteObject(key);
     }

}
