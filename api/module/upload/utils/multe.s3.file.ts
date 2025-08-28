
export interface MulterS3File extends Express.Multer.File {
    key?: string;
    location?: string;
    bucket?: string;
    etag?: string;
}