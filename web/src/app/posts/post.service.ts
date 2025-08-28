import { getAuthHeaders } from './../../utils/index';
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import pLimit from 'p-limit';
import {
     PaginatedResponse,
     PostFromServer,
     ExtractLinkParams,
     PostLinkMeta,

} from './type';
import imageCompression from "browser-image-compression";
const api = axios.create({
     baseURL: process.env.API_CONFIG || 'http://localhost:5000/v1/api',
});









// export const getPostUser = async ({
//     limit = 10,
//     pages,
//     userId,
//     onSuccess,
//     onError,
//     onFinally,
// }: GetPostsParams): Promise<void> => {
//     try {
//         const res = await api.get<PaginatedResponse<PostFromServer>>(`/posts?userId=${userId}`, {
//             params: { limit, page: pages },
//             headers: getAuthHeaders(),
//         });
//         onSuccess?.(res.data);
//     } catch (err: any) {
//         const message = err instanceof Error ? err.message : 'Failed to fetch posts';
//         console.error('Error fetching posts:', message);
//         onError?.(message);
//     }
//     finally {
//         onFinally?.();
//     }
// };


// tao post



export const createPost = async ({
     data,
     onSuccess,
     onError,
}: {
     data: {
          title: string;
          content: string;
          privacy?: string;
          userId: string;
          images?: string[]; // chỉ nhận URL
          videos?: string[]; // chỉ nhận URL
          hashtags?: string[];
          post_link_meta?: any;
          friends_tagged?: string[];
          post_count_feels?: {
               post_count_feels: number;
               post_count_comments: number;
               post_count_views: number;
          };
          feel?: { [key: string]: string };
          feelCount?: { [key: string]: number };
     };
     onSuccess?: (res: any) => void;
     onError?: (err: string) => void;
}) => {
     try {
          const res = await api.post('/posts/create', data, {
               headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
               },
          });
          console.log("logger:", res);
          onSuccess?.(res.data);
     } catch (err: any) {
          const message = err.response?.data?.message || err.message || 'Failed to create post';
          onError?.(message);
     }
};






const compressImage = async (file: File): Promise<File> => {
     const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
     return await imageCompression(file, options);
};

const compressVideo = async (file: File): Promise<File> => file;

const sliceFileIntoChunks = (file: File, size: number): Blob[] => {
     const chunks: Blob[] = [];
     let offset = 0;
     while (offset < file.size) {
          chunks.push(file.slice(offset, offset + size));
          offset += size;
     }
     return chunks;
};

const getUploadConfig = (fileSize: number): { chunkSize: number; parallelLimit: number } => {
     const chunkSize = fileSize > 100 * 1024 * 1024 ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // >100MB thì chunk 10MB
     const parallelLimit = 4; // max song song 4 chunks
     return { chunkSize, parallelLimit };
};

const uploadChunk = (
     url: string,
     chunk: Blob,
     contentType: string,
     onChunkProgress: (uploadedBytes: number) => void
) =>
     new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", url, true);
          xhr.setRequestHeader("Content-Type", contentType);

          xhr.upload.onprogress = (event) => {
               if (event.lengthComputable) onChunkProgress(event.loaded);
          };

          xhr.onload = () => {
               if (xhr.status >= 200 && xhr.status < 300) {
                    const eTag = xhr.getResponseHeader("ETag");
                    if (!eTag) return reject(new Error("Missing ETag"));
                    resolve(eTag.replace(/"/g, ""));
               } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
               }
          };

          xhr.onerror = () => reject(new Error("Upload error"));
          xhr.send(chunk);
     });

// ---- Main upload ----
export const uploadFileInChunks = async (
     files: File[],
     onProgress?: (fileIndex: number, percent: number) => void,
     onCancel?: (info: { uploadId: string; key: string }) => void
): Promise<string[]> => {
     const results: string[] = [];
     const limitFiles = pLimit(3); // tối đa 3 file upload cùng lúc

     await Promise.all(
          files.map((file, fileIndex) =>
               limitFiles(async () => {
                    let processedFile = file;
                    if (file.type.startsWith("image/")) processedFile = await compressImage(file);
                    else if (file.type.startsWith("video/")) processedFile = await compressVideo(file);

                    // Khởi tạo multipart upload
                    const initRes = await api.post("/upload/create-multipart", {
                         fileName: processedFile.name,
                         contentType: processedFile.type,
                    });
                    const { uploadId, key } = initRes.data;

                    // Lưu lại info để nếu cancel thì gọi abort
                    onCancel?.({ uploadId, key });

                    const { chunkSize, parallelLimit } = getUploadConfig(processedFile.size);
                    const chunks = sliceFileIntoChunks(processedFile, chunkSize);
                    const limitChunk = pLimit(parallelLimit);

                    let uploadedBytes = 0;
                    const totalBytes = processedFile.size;
                    const parts: { ETag: string; PartNumber: number }[] = [];

                    await Promise.all(
                         chunks.map((chunk, index) =>
                              limitChunk(async () => {
                                   const partNumber = index + 1;
                                   const MAX_RETRY = 3;

                                   for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
                                        try {
                                             const {
                                                  data: { url },
                                             } = await api.get("/upload/presigned-url", {
                                                  params: { uploadId, key, partNumber, contentType: processedFile.type },
                                             });

                                             const eTag = await uploadChunk(url, chunk, processedFile.type, (chunkUploaded) => {
                                                  uploadedBytes += chunkUploaded;
                                                  const percent = Math.min(100, Math.round((uploadedBytes / totalBytes) * 100));
                                                  onProgress?.(fileIndex, percent);
                                             });

                                             parts[partNumber - 1] = { ETag: eTag, PartNumber: partNumber };
                                             return;
                                        } catch (err) {
                                             if (attempt === MAX_RETRY - 1) throw err;
                                             await new Promise((res) => setTimeout(res, 500));
                                        }
                                   }
                              })
                         )
                    );

                    // Hoàn tất multipart upload
                    const completeRes = await api.post("/upload/complete-multipart", {
                         key,
                         uploadId,
                         parts,
                    });
                    console.log("✅ File uploaded to S3:", completeRes.data.location);
                    results[fileIndex] = completeRes.data.location;
               })
          )
     );

     return results;
};
export async function abortMultipartUpload(
     uploads: { uploadId: string; key: string }[]
) {
     try {
          await Promise.all(
               uploads.map((u) =>
                    api.post("/upload/abort-multipart", {
                         key: u.key,
                         uploadId: u.uploadId,
                    })
               )
          );
          console.log("✅ Aborted all multipart uploads");
     } catch (err) {
          console.error("❌ Failed to abort multipart upload", err);
     }
}


export async function deleteObject(key: string) {
     const res = await api.delete(`/upload/object?key=${encodeURIComponent(key)}`);
     return res.data; 
}


export const extractLinkMetadata = async ({
     url,
     onSuccess,
     onError,
}: ExtractLinkParams): Promise<void> => {
     try {
          const res = await api.post<{ metadata: PostLinkMeta }>(
               '/posts/extract-link-metadata',
               { url },
               { headers: getAuthHeaders() }
          );
          onSuccess?.(res.data.metadata);
     } catch (err: any) {
          const message = err instanceof Error ? err.message : 'Failed to extract link metadata';
          console.error('Error extracting metadata:', message);
          onError?.(message);
     }
};


export async function updatePostFeel({
     postId,
     type,
}: {
     postId: string;
     type: string | ""
}) {
     try {
          const res = await api.post(`/feel`, { type, postId }, { headers: getAuthHeaders() });
          return res.data;
     } catch (err) {
          console.error(err);
          throw new Error('Failed to update feel');
     }
}


export const getFriends = async ({
     limit,
     onSuccess,
     onError,
}: {
     limit?: number;
     onSuccess?: (data: any) => void;
     onError?: (err: any) => void;
}) => {
     try {

          const res = await api.post(`/friends?type=all&limit=${limit}`, {
               headers: getAuthHeaders()
          });

          //console.log('data_res', res);
          onSuccess?.(res.data);
     } catch (err: any) {
          onError?.(err.response?.data || err.message || err);
     }
};


export const searchFriendUsers = async ({ name }: { name: string }) => {
     try {
          const res = await api.get(`/user/search?query=${name}`, {
               headers: getAuthHeaders(),
          });

          return res.data?.metadata || [];
     } catch (err: any) {
          console.error("searchFriendUsers error:", err);
          throw err;
     }
};



