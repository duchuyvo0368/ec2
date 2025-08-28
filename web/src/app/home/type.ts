// src/types/index.ts

import { PaginatedResponse, PostFromServer, PostResponse } from "../posts/type";

export interface UserInfo {
  _id: string;
  name: string;
  avatar: string;
  
}

export interface GetPostUserParams {
  limit?: number;
    page: number;
    
    onSuccess?: (data: PaginatedResponse<PostFromServer>) => void;
    onError?: (msg: string) => void;
    onFinally?: () => void;
}

export interface CommentType {
    _id: string;
    comment_post_id: string;
    comment_user_id: {
        _id: string;
        name: string;
        avatar: string;
    };
    comment_content: string;
    comment_parent_id?: string | null;
    sticker?: string;
    createdAt: string;
    children?: CommentType[];
    user?: {
        _id: string;
        name: string;
        avatar: string;
    } | null;
    replies?: CommentType[];
}



