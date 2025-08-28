/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getCommentsByPostId, addComment, replyComment, deleteComment, emitCommentTyping, emitCommentStopTyping } from '../comment.service';
import { CommentType } from '@/app/home/type';
import { useSocket } from '@/app/context/Socket';
import { UserInfo } from '@/app/home/type';
import { FeelType } from '@/app/posts/type';
import { updatePostFeel } from '@/app/user/api/user.service';
import { useFeelSync } from '@/app/posts/hooks/useFeelSync';

interface UsePostCommentsProps {
     postId: string;
     feelCount?: Record<string, number>;
     my_feel: string;
     onCommentCountChange?: (newCount: number | ((prev: number) => number)) => void;
     onFeelUpdate?: (newFeel: string, newFeelCounts: Record<string, number>) => void;
}

const COMMENTS_PER_PAGE = 10;

export const usePostComments = ({ postId, feelCount, my_feel, onCommentCountChange, onFeelUpdate }: UsePostCommentsProps) => {
     const userInfo = useMemo(() => {
          if (typeof window === 'undefined') return {};
          return JSON.parse(localStorage.getItem('userInfo') || '{}');
     }, []);
     const [comments, setComments] = useState<CommentType[]>([]);
     const [isLoading, setIsLoading] = useState(false);
     const [isLoadingMore, setIsLoadingMore] = useState(false);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [page, setPage] = useState(1);
     const [hasMore, setHasMore] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const { socket, joinPost, leavePost, onNewComment } = useSocket();
     const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

     // Join post room when component mounts
     useEffect(() => {
          if (postId) {
               joinPost(postId);
          }

          return () => {
               if (postId) {
                    leavePost(postId);
               }
          };
     }, [postId, joinPost, leavePost]);

     // Listen for real-time new comments
     useEffect(() => {
          const handleNewComment = (newComment: CommentType) => {
               console.log('Received new comment via socket:', newComment);

               // Only handle comments from other users
               const newCommentUserId = typeof newComment.comment_user_id === 'object'
                    ? newComment.comment_user_id._id
                    : newComment.comment_user_id;

               if (newCommentUserId === userInfo?._id) {
                    console.log('Skipping current user comment from socket');
                    return;
               }

               setComments(prev => {
                    // Check if comment already exists by ID
                    const existsById = prev.some(comment => comment._id === newComment._id);
                    if (existsById) {
                         console.log('Comment already exists by ID, skipping');
                         return prev;
                    }

                    console.log('Adding new comment from other user');
                    // Add new comment at the beginning
                    return [newComment, ...prev];
               });

               // Update comment count
               if (onCommentCountChange) {
                    onCommentCountChange(prev => prev + 1);
               }
          };

          onNewComment(handleNewComment);

          return () => {
               // Cleanup listeners if needed
          };
     }, [onNewComment, onCommentCountChange, userInfo]);

     const fetchComments = useCallback(async (pageNum = 1, append = false) => {
          if (!postId) return;


          const shouldBackgroundRefresh = pageNum === 1 && comments.length > 0 && !append;
          const loadingState = pageNum === 1
               ? (shouldBackgroundRefresh ? (() => undefined) as any : setIsLoading)
               : setIsLoadingMore;

          loadingState(true);
          setError(null);

          getCommentsByPostId({
               postId,
               page: pageNum,
               limit: COMMENTS_PER_PAGE,
               onSuccess: (data) => {
                    console.log('Comments API response:', data);
                    if (data?.metadata?.data) {
                         const newComments = data.metadata.data;

                         if (append) {
                              setComments(prev => [...prev, ...newComments]);
                         } else {
                              setComments(newComments);
                         }

                         // Check if there are more comments
                         setHasMore(newComments.length === COMMENTS_PER_PAGE);
                    } else {
                         if (!append && !shouldBackgroundRefresh) {
                              setComments([]);
                         }
                         setHasMore(false);
                    }
               },
               onError: (error) => {
                    console.error('Failed to fetch comments:', error);
                    setError('Failed to load comments');
               },
               onFinally: () => {
                    loadingState(false);
               }
          });
     }, [postId, comments.length]);

     // Refetch pages 1..current page to keep current viewport intact (helps nested replies appear)
     const refreshAllLoadedPages = useCallback(() => {
          if (!postId) return;

          getCommentsByPostId({
               postId,
               page: 1,
               limit: COMMENTS_PER_PAGE,
               onSuccess: (data) => {
                    const base = data?.metadata?.data || [];
                    setComments(base);
                    setHasMore(base.length === COMMENTS_PER_PAGE);

                    if (page > 1) {
                         for (let p = 2; p <= page; p += 1) {
                              getCommentsByPostId({
                                   postId,
                                   page: p,
                                   limit: COMMENTS_PER_PAGE,
                                   onSuccess: (appendData) => {
                                        const items = appendData?.metadata?.data || [];
                                        if (items.length > 0) {
                                             setComments(prev => [...prev, ...items]);
                                        }
                                   },
                              });
                         }
                    }
               },
          });
     }, [postId, page]);

     const loadMoreComments = useCallback(() => {
          if (isLoadingMore || !hasMore) return;

          const nextPage = page + 1;
          setPage(nextPage);
          fetchComments(nextPage, true);
     }, [isLoadingMore, hasMore, page, fetchComments]);
     const { updateFeel } = useFeelSync(postId, userInfo._id, my_feel as FeelType);


     const submitComment = useCallback(async (content: string, parentId?: string) => {
          if (!userInfo || !postId || !content.trim()) return;

          setIsSubmitting(true);
          setError(null);

          // Call API first
          const apiCall = parentId ? replyComment : addComment;
          apiCall({
               commentPostId: postId,
               commentUserId: userInfo._id,
               commentParentId: parentId || '',
               commentContent: content,
               onSuccess: (data) => {
                    console.log('API success, reloading comments');

                   
                    refreshAllLoadedPages();

                    if (onCommentCountChange) {
                         onCommentCountChange(prev => prev + 1);
                    }

                    setIsSubmitting(false);
               },
               onError: (error) => {
                    console.error('Failed to submit comment:', error);
                    setError('Failed to post comment');
                    setIsSubmitting(false);
               }
          });
     }, [postId, userInfo, onCommentCountChange, fetchComments, refreshAllLoadedPages]);

     const handleDeleteComment = useCallback(async (commentId: string) => {
          setComments(prev => {
               const newComments = prev.filter(comment => comment._id !== commentId);

               if (onCommentCountChange) {
                    onCommentCountChange(newComments.length);
               }

               return newComments;
          });

          try {
               await new Promise<void>((resolve, reject) => {
                    deleteComment({
                         commentId,
                         onSuccess: () => {
                              resolve();
                         },
                         onError: (error) => {
                              console.error('Failed to delete comment:', error);
                              // Could add logic to restore comment if needed
                              reject(error);
                         }
                    });
               });
          } catch (error) {
               console.error('Error deleting comment:', error);
          }
     }, [onCommentCountChange]);

     const addReplyToComment = useCallback((newReply: CommentType) => {
          const insertReplyRecursive = (list: CommentType[]): CommentType[] => {
               return list.map((item) => {
                    if (item._id === newReply.comment_parent_id) {
                         const existingReplies = item.replies || [];
                         return {
                              ...item,
                              replies: [...existingReplies, newReply],
                         };
                    }

                    // Recurse into children
                    if (item.replies && item.replies.length > 0) {
                         return {
                              ...item,
                              replies: insertReplyRecursive(item.replies),
                         };
                    }

                    return item;
               });
          };

          setComments((prev) => insertReplyRecursive(prev));
     }, []);

     // Typing indicators
     const handleTyping = useCallback((isTyping: boolean) => {
          if (!userInfo || !socket) return;

          if (isTyping) {
               emitCommentTyping(socket, postId, {
                    id: userInfo._id,
                    name: userInfo.name,
                    postId: postId
               });
          } else {
               emitCommentStopTyping(socket, postId, {
                    id: userInfo._id,
                    name: userInfo.name,
                    postId: postId
               });
          }
     }, [userInfo, socket, postId]);

     const debouncedStopTyping = useCallback(() => {
          if (typingTimeoutRef.current) {
               clearTimeout(typingTimeoutRef.current);
          }

          typingTimeoutRef.current = setTimeout(() => {
               handleTyping(false);
          }, 1000);
     }, [handleTyping]);

     const startTyping = useCallback(() => {
          handleTyping(true);
          debouncedStopTyping();
     }, [handleTyping, debouncedStopTyping]);



     const handleFeelClick = useCallback(
          async (type: FeelType) => {
               const newFeel = my_feel === type ? '' : type;
               const oldFeel = my_feel;

               try {
                    await updatePostFeel({ postId, type: newFeel });

                    // Calculate new feel counts
                    const newFeelCounts = { ...feelCount };
                    if (oldFeel && newFeelCounts[oldFeel] !== undefined) {
                         newFeelCounts[oldFeel] = Math.max(newFeelCounts[oldFeel] - 1, 0);
                    }
                    if (newFeel) {
                         newFeelCounts[newFeel] = (newFeelCounts[newFeel] || 0) + 1;
                    }

                    // Call callback to update parent state
                    if (onFeelUpdate) {
                         onFeelUpdate(newFeel, newFeelCounts);
                    }

                    updateFeel(newFeel);
               } catch (error) {
                    console.error('Failed to update feel:', error);
               }
          },
          [postId, my_feel, feelCount, onFeelUpdate, userInfo._id]
     );
     return {
          comments,
          isLoading,
          isLoadingMore,
          isSubmitting,
          hasMore,
          error,
          handleFeelClick,
          fetchComments,
          loadMoreComments,
          submitComment,
          handleDeleteComment,
          addReplyToComment,
          startTyping,
          stopTyping: () => handleTyping(false),
     };
};


