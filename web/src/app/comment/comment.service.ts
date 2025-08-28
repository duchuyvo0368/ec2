
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getAuthHeaders } from '@/utils';

const API_CONFIG = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api';

export const getPostById = async ({
     postId,
     onSuccess,
     onError,
     onFinally,
}: {
     postId: string;
     onSuccess?: (data: any) => void;
     onError?: (err: any) => void;
     onFinally?: () => void;
}) => {
     try {
          const res = await axios.get(`${API_CONFIG}/posts/${postId}`, {
               headers: getAuthHeaders()
          });

          onSuccess?.(res.data);
     } catch (err: any) {
          onError?.(err.response?.data || err.message || err);
     }
     finally {
          onFinally?.();
     }
};

export const getCommentsByPostId = async ({
     postId,
     page = 1,
     limit = 10,
     onSuccess,
     onError,
     onFinally,
}: {
     postId: string;
     page?: number;
     limit?: number;
     onSuccess?: (data: any) => void;
     onError?: (err: any) => void;
     onFinally?: () => void;
}) => {
     try {
          const res = await axios.get(`${API_CONFIG}/comment/${postId}`, {
               params: { page, limit },
               headers: getAuthHeaders()
          });

          onSuccess?.(res.data);
     } catch (err: any) {
          onError?.(err.response?.data || err.message || err);
     }
     finally {
          onFinally?.();
     }
};

export const addComment = async ({
     commentPostId,
     commentUserId,
     commentParentId,
     commentContent,
     onSuccess,
     onError,
     onFinally,
}: {
     commentPostId: string;
     commentUserId: string;
     commentParentId: string;
     commentContent: string;
     onSuccess?: (data: any) => void;
     onError?: (err: any) => void;
     onFinally?: () => void;
}) => {
     try {
          const res = await axios.post(`${API_CONFIG}/comment/create`, {
               commentPostId,
               commentUserId,
               commentParentId,
               commentContent,
          }, {
               headers: getAuthHeaders()
          });

          onSuccess?.(res.data);
     } catch (err: any) {
          onError?.(err.response?.data || err.message || err);
     }
     finally {
          onFinally?.();
     }
};

export const replyComment = async ({
     commentPostId,
     commentUserId,
     commentParentId,
     commentContent,
     onSuccess,
     onError,
     onFinally,
}: {
     commentPostId: string;
     commentUserId: string;
     commentParentId: string;
     commentContent: string;
     onSuccess?: (data: any) => void;
     onError?: (err: any) => void;
     onFinally?: () => void;
}) => {
     try {
          const res = await axios.post(`${API_CONFIG}/comment/create`, {
               commentPostId,
               commentUserId,
               commentParentId,
               commentContent,
          }, {
               headers: getAuthHeaders()
          });

          onSuccess?.(res.data);
     } catch (err: any) {
          onError?.(err.response?.data || err.message || err);
     }
     finally {
          onFinally?.();
     }
};

export const deleteComment = async ({
     commentId,
     onSuccess,
     onError,
     onFinally,
}: {
     commentId: string;
     onSuccess?: (data: any) => void;
     onError?: (err: any) => void;
     onFinally?: () => void;
}) => {
     try {
          const res = await axios.post(`${API_CONFIG}/comment/delete`,
               { commentId },
               { headers: getAuthHeaders() }
          );

          onSuccess?.(res.data);
     } catch (err: any) {
          onError?.(err.response?.data || err.message || err);
     } finally {
          onFinally?.();
     }
};

// Real-time comment events
export const emitNewComment = (socket: any, commentData: any) => {
     if (socket) {
          socket.emit('newComment', commentData);
     }
};

export const emitCommentTyping = (socket: any, postId: string, user: any) => {
     if (socket) {
          socket.emit('commentTyping', { postId, user });
     }
};

export const emitCommentStopTyping = (socket: any, postId: string, user: any) => {
     if (socket) {
          socket.emit('commentStopTyping', { postId, user });
     }
};
