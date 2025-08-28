

export interface UploadConfig {
     chunkSize: number;
     parallelLimit: number;
}

export const getUploadConfig = (fileSize: number): UploadConfig => {
     const MB = 1024 * 1024;
     const GB = 1024 * MB;

     if (fileSize <= 1 * MB) {
          // File nhỏ → upload 1 lần luôn
          return {
               chunkSize: fileSize,
               parallelLimit: 1,
          };
     }

     if (fileSize <= 10 * MB) {
          // File nhỏ vừa → 2MB/chunk
          return {
               chunkSize: 2 * MB,
               parallelLimit: 2,
          };
     }

     if (fileSize <= 50 * MB) {
          // File vừa → 5MB/chunk
          return {
               chunkSize: 5 * MB,
               parallelLimit: 4,
          };
     }

     if (fileSize <= 200 * MB) {
          // File lớn hơn → 8MB/chunk
          return {
               chunkSize: 8 * MB,
               parallelLimit: 6,
          };
     }

     if (fileSize <= 2 * GB) {
          // File cực lớn → 10MB/chunk, nhiều request song song
          return {
               chunkSize: 10 * MB,
               parallelLimit: 8,
          };
     }

     throw new Error("❌ File size exceeds 2GB.");
};
