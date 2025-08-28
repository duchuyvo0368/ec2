

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Feel } from "@/app/posts/type";
import { UserInfo } from "../../home/type";


export interface GetPostsParams {
    limit?: number;
    pages: number;
    userId: string;
    onSuccess?: (res: PaginatedResponse<PostFromServer>) => void;
    onError?: (msg: string) => void;
    onFinally?: () => void;
}


export interface PostCardProps {
    postId: string;
    userName: string;
    relation: string;
    avatar: string;
    time: string;
    title: string;
    content: string;
    images: string[];
    hashtags: string[];
    videos: string[];
    friends_tagged?: string[];
    feels: Feel[];
    feel_count: { [key: string]: number };
    comments: number;
    privacy: 'public' | 'friend';
    views: number;
    createdAt: string;
    post_link_meta?: PostLinkMeta
    handleGetPost: () => void;
    my_feel?: string; 
}

export interface CreateMultipartResponse {
    uploadId: string;
    key: string;
}

export interface PresignedUrlResponse {
    url: string;
}

export interface UploadPart {
    ETag: string;
    PartNumber: number;
}




// Post types



export interface PostFromServer {
    _id: string;
    title: string;
    content: string;
    hashtags?: string[];
    createdAt: string;
    userId: UserInfo;
    images?: string[];
    videos?: string[];
    friends_tagged?: string[];
    privacy: 'public' | 'friend';
    post_link_meta?: PostLinkMeta;
    feel_count: { [key: string]: number };
    feels: Feel[];
    comments: number;
    views: number;
    my_feel?: string; // Feel của user hiện tại đang đăng nhập
}





export interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    images?: string[];
    videos?: string[];
    privacy: 'public' | 'friend';
    userId: string;
    friends_tagged?: string[];
    hashtags?: string[];
    feel?: { [key: string]: string };
    feelCount?: { [key: string]: number };
    comments: number;
}


export interface EditPostModalProps {
    open: boolean;
    onClose: () => void;
    userInfo: UserInfo;
    postData?: PostFromServer;
    handleGetPost: () => void;
}
export interface UserCardProps {
    userId: string;
    name: string;
    avatar: string;
    mutualFriends?: string;
    followersCount?: number;
    isFollowing: boolean;
}



export interface ExtractLinkParams {
    url: string;
    onSuccess?: (meta: PostLinkMeta) => void;
    onError?: (msg: string) => void;
}

export interface PostLinkMeta {
    post_link_url?: string;
    post_link_title?: string;
    post_link_description?: string;
    post_link_content?: string;
     post_link_image?: string;
     post_link_video?: string;
     type?: string;
}

export interface UploadPostParams {
    postId: string;
    title: string;
    content: string;
    privacy: string;
    userId: string;
    images: string[];
    videos: string[];
    hashtags: string[];
    post_link_meta?: PostLinkMeta | null;
    friends_tagged?: string[];
    post_count_feels?: {
        post_count_feels: number;
        post_count_comments: number;
        post_count_views: number;
    };
    feel?: { [key: string]: string };
    feelCount?: { [key: string]: number };
}
export interface CreatePostParams {
    data: {
        title?: string;
        content?: string;
        userId: string;
        images?: string[] | null;
        videos?: string[] | null;
        post_link_meta?: PostLinkMeta | null;
        hashtags?: string[];
        privacy?: 'public' | 'friend';
        friends_tagged?: string[];
        feelCount?: { [key: string]: number };
        feel?: { [key: string]: string };
        comments?: number;
    };
    onSuccess?: (res: PostResponse) => void;
    onError?: (error: string) => void;
}

export interface PostResponse {
    _id: string;
    title: string;
    content: string;
    images?: string[];
    videos?: string[];
    post_link_meta?: PostLinkMeta;
    userId: string;
    hashtags?: string[];
    friends_tagged?: string[];
    createdAt: string;
    privacy: 'public' | 'friend';
    updatedAt: string;
    feelCount: { [key: string]: number };
    feel: { [key: string]: string };
    comments: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}