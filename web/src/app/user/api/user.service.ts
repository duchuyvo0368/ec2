import { metadata } from '../../layout';

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { refreshToken } from '../../login/auth.service';
import { getAuthHeaders } from '@/utils';
import pLimit from 'p-limit';
import { getUploadConfig } from '@/utils/constants';
import { ExtractLinkParams, PaginatedResponse, PostFromServer, PostLinkMeta } from '../../posts/type';
import { log } from 'console';
import { PostResponse, UploadPostParams } from './type';

const API_CONFIG = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api';
const api = axios.create({ baseURL: API_CONFIG });

// Attach token and auto-refresh on 401
export const getAllUser = async ({
    limit,
    page,
    onSuccess,
    onError,
}: {
    limit?: number;
    page?: number
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;

}) => {
    try {
        const res = await api.get(`/user/all?limit=${limit}&page=${page}`, {


            headers: getAuthHeaders()

        });

        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};
export const addFriend = async ({
    userId,
    type = "send",
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    type?: "send";
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await api.post(`/friends/update-status`,
            {
                userId,
                type
            },
            {
                headers: getAuthHeaders()
            })

        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        const errorData = err.response?.data || err.message || err;
        if (errorData && Object.keys(errorData).length > 0) {
            onError?.(errorData);
        } else {
            onError?.({ message: 'Unknown error occurred' });
        }
    }
    finally {
        onFinally?.();
    }
};
export const acceptFriend = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await api.post(`/friends/update-status`,
            {
                userId,
                type: "accept"
            },
            {
                headers: getAuthHeaders()
            })

        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};

export const rejectFriend = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await api.post(`/friends/update-status`,
            {
                userId,
                type: "reject"
            },
            {
                headers: getAuthHeaders()
            })

        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};
export const addFollow = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await api.post(`/friends/update-status`,
            {
                userId,
                type: "follow"
            },
            {
                headers: getAuthHeaders()
            })

        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};
export const unFollow = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,
            {
                userId,
                type: "unfollow"
            },
            {
                headers: getAuthHeaders()
            })

        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};

export const getProfile = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    type?: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await api.get(`/user/profile/${userId}`, {
            headers: getAuthHeaders()
        });


        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};


export const uploadFile = async ({
    type,
    file,
    onSuccess,
    onError,
    onFinally,
}: {
    type: string;
    file: File;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await api.post(`/user/upload-avatar`, formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('upload_res', res);
        onSuccess?.(res.data);
        
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};


export const cancelRequest = async ({ userId, onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await api.post(`/friends/update-status`,
            {
                userId,
                type: "deleted"
            },
            {
                headers: getAuthHeaders()
            })


        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};

export const unFriend = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`, {
            userId,
            type: "unfriend"
        },
            {
                headers: getAuthHeaders()
            })
        //console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};




export const getPostByUser = async ({
    limit = 10,
    pages,
    userId,
    onSuccess,
    onError,
    onFinally,
}: GetPostsParams): Promise<void> => {
    try {
        const res = await axios.get<PaginatedResponse<PostFromServer>>(`${API_CONFIG}/posts/user?userId=${userId}`, {
            params: { limit, page: pages },
            headers: getAuthHeaders(),
        });
        onSuccess?.(res.data);
    } catch (err: any) {
        const message = err instanceof Error ? err.message : 'Failed to fetch posts';
        console.error('Error fetching posts:', message);
        onError?.(message);
    }
    finally {
        onFinally?.();
    }
};



// danh sach post

interface GetPostsParams {
    limit?: number;
    pages: number;
    userId: string;
    onSuccess?: (res: PaginatedResponse<PostFromServer>) => void;
    onError?: (msg: string) => void;
    onFinally?: () => void;
}

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




//Upload



// utils/upload.ts
export const sliceFileIntoChunks = (file: File, size: number): Blob[] => {
    const chunks: Blob[] = [];
    let offset = 0;
    while (offset < file.size) {
        chunks.push(file.slice(offset, offset + size));
        offset += size;
    }
    return chunks;
};


export const uploadFileInChunks = async (file: File, onProgress?: (percent: number) => void) => {
    const initRes = await api.post('/upload/create-multipart', {
        fileName: file.name,
        contentType: file.type,
    });
    const { uploadId, key } = initRes.data;
    const { chunkSize, parallelLimit } = getUploadConfig(file.size);
    const chunks = sliceFileIntoChunks(file, chunkSize);
    const limit = pLimit(parallelLimit);
    const parts: { ETag: string; PartNumber: number }[] = [];
    let uploadedCount = 0;


    console.log("logger:", uploadId, key);
    await Promise.all(chunks.map((chunk, index) =>
        limit(async () => {
            const partNumber = index + 1;

            // Retry logic
            const MAX_RETRY = 3;
            for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
                try {
                    const presignedRes = await api.get('/upload/presigned-url', {
                        params: { uploadId, key, partNumber, contentType: file.type },
                    });
                    console.log("logger:", presignedRes);
                    const url = presignedRes.data.url;

                    const uploadRes = await fetch(url, {
                        method: 'PUT',
                        headers: { 'Content-Type': file.type },
                        body: chunk,
                    });

                    const eTag = uploadRes.headers.get('ETag');
                    if (!eTag) throw new Error(`Missing ETag for part ${partNumber}`);

                    console.log("tag:", eTag);
                    parts[partNumber - 1] = {
                        ETag: eTag.replace(/"/g, ''),
                        PartNumber: partNumber,
                    };

                    uploadedCount++;
                    onProgress?.(Math.round((uploadedCount / chunks.length) * 100));
                    return;
                } catch (err) {
                    if (attempt === MAX_RETRY - 1) throw err;
                    await new Promise((res) => setTimeout(res, 500));
                }
            }
        })
    ));

    const completeRes = await api.post('/upload/complete-multipart', {
        key,
        uploadId,
        parts,
    });

    return { location: completeRes.data.location };
};



// Extract metadata



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
        const res = await api.post(
            `/feel`,
            { type, postId },
            {
                headers: getAuthHeaders(),
            }
        );

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

// Sửa lại để return
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


export const getPostId = async ({ postId }: { postId: string }): Promise<PostFromServer> => {
    try {
        const res = await api.get(`${API_CONFIG}/posts/${postId}`, {
            headers: getAuthHeaders(),
        });
        //console.log("logger:", res.data);
        return res.data.metadata;
    } catch (err: any) {
        console.error("getPostId error:", err);
        throw err;
    }
};


export const uploadPost = async ({
    postId,
    title,
    content,
    privacy,
    userId,
    images,
    videos,
    hashtags,
    post_link_meta,
    friends_tagged,
    post_count_feels,
    feel,
    feelCount,
}: UploadPostParams) => {
    try {
        const res = await api.patch(`/posts/${postId}`, {
            title,
            content,
            privacy,
            userId,
            images,
            videos,
            hashtags,
            post_link_meta,
            friends_tagged,
            post_count_feels,
            feel,
            feelCount,
        }, {
            headers: getAuthHeaders(),
        });
        console.log("uploadPost response:", res.data);
        return res.data.metadata.post; // trả về post đã cập nhật
    } catch (err: any) {
        console.error("uploadPost error:", err);
        throw err;
    }
};
export const deletePost = async ({ postId }: { postId: string }) => {
    try {
        const res = await api.delete(`/posts/${postId}`, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to delete post');
    }
};
