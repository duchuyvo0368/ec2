/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommentType, UserInfo } from "../home/type";
import { PostLinkMeta, Feel } from "../posts/type";

export interface PostCommentModalProps {
    open: boolean;
    onClose: () => void;
    postData: PostData;
    userInfo: UserInfo;
    postUserInfo?: {
        name: string;
        avatar: string;
    };
    onFeelUpdate?: (newFeelCounts: Record<string, number>, newFeel: any[]) => void;
    onCommentCountUpdate?: (newCount: number) => void;
}
export interface PostData {
    id: string;
    content: string;
    hashtags?: string[];
    privacy?: 'public' | 'friend';
    images: string[];
    videos?: string[];
    feel?: Feel[]; 
    feelCount?: { [key: string]: number };
    views?: number;
    comments?: CommentType[];
    createdAt: string;
    post_link_meta?: PostLinkMeta | null;
    comment_count:number;
    onNewComment?: (comment: CommentType) => void;
    userFeel?: string; // Thêm userFeel để truyền từ PostCard
    my_feel?: string; // Feel của user hiện tại đang đăng nhập
}