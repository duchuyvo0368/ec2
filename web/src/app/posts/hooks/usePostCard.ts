/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { FeelType } from '../type';
import { updatePostFeel } from '../post.service';
import { useFeelSync } from '../hooks/useFeelSync';

interface UserInfo {
     _id?: string;
     name?: string;
     avatar?: string;
     [key: string]: unknown;
}

export function usePostCard({
     postId,
     feelCount,
     my_feel,
     media,
}: {
     postId: string;
     feelCount?: Record<string, number>;
     my_feel?: string;
     media?: string[];
}) {
     // userInfo chỉ lấy 1 lần
     const userInfo = useMemo<UserInfo>(() => {
          if (typeof window === 'undefined') return {};
          return JSON.parse(localStorage.getItem('userInfo') || '{}') as UserInfo;
     }, []);

     const userId = userInfo._id ?? '';

     const [userFeel, setUserFeel] = useState<FeelType>(my_feel as FeelType || '');
     const [showModal, setShowModal] = useState(false);
     const [showShare, setShowShare] = useState(false)
     const [feelCounts, setFeelCounts] = useState<Record<string, number>>(feelCount || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 });
     const [selectedIndex, setSelectedIndex] = useState(0);
     const [showReactions, setShowReactions] = useState(false);

     const btnRef = useRef<HTMLDivElement | null>(null);
     const thumbRef = useRef<HTMLDivElement | null>(null);

     const { updateFeel } = useFeelSync(postId, userId, userFeel);


     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (btnRef.current && !btnRef.current.contains(event.target as Node)) {
                    setShowReactions(false);
               }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
     }, []);

     useEffect(() => {
          setUserFeel(my_feel as FeelType || '');
     }, [my_feel]);

     useEffect(() => {
          const handleFeelUpdated = (e: CustomEvent) => {
               if (e.detail.postId === postId && e.detail.userId === userId) {
                    setUserFeel(e.detail.feel as FeelType);
               }
          };

          window.addEventListener('feelUpdated', handleFeelUpdated as EventListener);
          return () => {
               window.removeEventListener('feelUpdated', handleFeelUpdated as EventListener);
          };
     }, [postId, userId]);

     useEffect(() => {
          setFeelCounts(feelCount || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 });
     }, [feelCount]);

     // Auto-advance media carousel when multiple media items exist
     useEffect(() => {
          const mediaLength = media?.length ?? 0;
          if (mediaLength > 1) {
               const interval = setInterval(() => {
                    setSelectedIndex((prev) => (prev === mediaLength - 1 ? 0 : prev + 1));
                    thumbRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
               }, 3000);
               return () => clearInterval(interval);
          }
     }, [media?.length]);

     const totalFeelCount = useMemo(
          () => Object.values(feelCounts || {}).reduce((acc, cur) => acc + (cur || 0), 0),
          [feelCounts]
     );

     const handleFeelClick = useCallback(
          async (type: FeelType) => {
               const newFeel = userFeel === type ? '' : type;
               const oldFeel = userFeel;

               try {
                    await updatePostFeel({ postId, type: newFeel });

                    setFeelCounts(prev => {
                         const newCounts = { ...prev };
                         if (oldFeel && newCounts[oldFeel] !== undefined) {
                              newCounts[oldFeel] = Math.max(newCounts[oldFeel] - 1, 0);
                         }
                         if (newFeel) {
                              newCounts[newFeel] = (newCounts[newFeel] || 0) + 1;
                         }
                         return newCounts;
                    });

                    setUserFeel(newFeel);

                    updateFeel(newFeel);
               } catch (error) {
                    console.error('Failed to update feel:', error);
               }
          },
          [postId, userFeel, userId]
     );

     return {
          userInfo,
          userFeel,
          showModal,
          feelCounts,
          showShare,
          totalFeelCount,
          selectedIndex,
          showReactions,
          btnRef,
          thumbRef,
          setShowShare,
          setShowModal,
          setSelectedIndex,
          setShowReactions,
          handleFeelClick,
          setFeelCounts,
     };
}
