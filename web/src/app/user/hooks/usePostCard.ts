import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { deletePost, getPostId, updatePostFeel } from '../api/user.service';
import { PostFromServer } from '../api/type';
import { Feel, FeelType } from '@/app/posts/type';

export function usePostCard({
     postId,
     feel,
     feelCount,
     handleGetPost,
}: {
     postId: string;
     feel?: Feel[];
     feelCount?: Record<string, number>;
     handleGetPost: () => void;
}) {
     const [showEditModal, setShowEditModal] = useState(false);
     const [showCommentModal, setShowCommentModal] = useState(false);
     const [postBeingEdited, setPostBeingEdited] = useState<PostFromServer>();
     const [selectedIndex, setSelectedIndex] = useState(0);
     const [showReactions, setShowReactions] = useState(false);
     const [userFeel, setUserFeel] = useState<FeelType>('');
     const [feelCounts, setFeelCounts] = useState<Record<string, number>>(feelCount || {});
     const btnRef = useRef<HTMLDivElement | null>(null);
     const thumbRef = useRef<HTMLDivElement | null>(null);

     useEffect(() => {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
          const userFeelObj = feel?.find(f => f.userId === userInfo._id);
          setUserFeel(userFeelObj?.feel_type || '');
     }, [feel]);

     const totalFeelCount = useMemo(() => Object.values(feelCounts || {}).reduce((acc, cur) => acc + cur, 0), [feelCounts]);

     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (btnRef.current && !btnRef.current.contains(event.target as Node)) {
                    setShowReactions(false);
               }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
     }, []);

     const handleFeelClick = useCallback(async (type: FeelType) => {
          const newFeel = userFeel === type ? '' : type;
          const oldFeel = userFeel;
          try {
               await updatePostFeel({ postId, type: newFeel });
               setFeelCounts(prev => {
                    const newCounts = { ...prev };
                    if (oldFeel && newCounts[oldFeel]) newCounts[oldFeel] = Math.max(newCounts[oldFeel] - 1, 0);
                    if (newFeel) newCounts[newFeel] = (newCounts[newFeel] || 0) + 1;
                    return newCounts;
               });
               setUserFeel(newFeel);
          } catch (error) {
               console.error('Failed to update feel:', error);
          }
     }, [postId, userFeel]);

     const handleEdit = useCallback(async () => {
          const postData = await getPostId({ postId });
          setPostBeingEdited(postData);
          setShowEditModal(true);
     }, [postId]);

     const handleDelete = useCallback(async () => {
          if (!confirm('Are you sure you want to delete this post?')) return;
          await deletePost({ postId });
          handleGetPost();
     }, [postId, handleGetPost]);

     return {
          showEditModal,
          showCommentModal,
          postBeingEdited,
          selectedIndex,
          showReactions,
          userFeel,
          feelCounts,
          totalFeelCount,
          btnRef,
          thumbRef,
          setShowEditModal,
          setShowCommentModal,
          setSelectedIndex,
          setShowReactions,
          handleFeelClick,
          handleEdit,
          handleDelete,
     };
}
