import { UserInfo } from './type';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { refreshToken } from '../login/auth.service';
import { GetPostUserParams } from './type';
import { getAuthHeaders } from '@/utils';
import { PaginatedResponse, PostFromServer, PostResponse } from '../posts/type';


const api = axios.create({
    baseURL: process.env.API_CONFIG || 'http://localhost:5000/v1/api',
});


export const getPostUser = async ({
    limit,
    page,
    onSuccess,
    onError,
}: GetPostUserParams): Promise<void> => {
    try {
        const res = await api.get<PaginatedResponse<PostFromServer>>('/posts', {
            params: { limit, page: page },
            headers: getAuthHeaders(),
        });

        onSuccess?.(res.data);
        console.log("res.data:", res.data);
    } catch (err: any) {
        const message = err instanceof Error ? err.message : 'Lỗi không xác định';
        // console.error('Error fetching posts:', message);
        onError?.(message);
    }
};






