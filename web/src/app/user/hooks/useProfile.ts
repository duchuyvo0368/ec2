/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
     addFollow,
     addFriend,
     acceptFriend,
     cancelRequest,
     getPostByUser,
     getProfile,
     unFollow,
     unFriend,
     uploadFile,
} from '../api/user.service';
import { PostFromServer } from '../api/type';
import { UserInfo } from '@/app/home/type';

type RelationType = 'me' | 'accepted' | 'pending_sent' | 'pending_received' | 'following' | 'followed' | 'stranger';

export function useProfile() {
     const [userId, setUserId] = useState<string | null>(null);
     const [user, setUser] = useState<{ name: string; avatar?: string; email?: string } | null>(null);
     const [loading, setLoading] = useState(true);
     const [relation, setRelation] = useState<RelationType | null>(null);
     const [friendCount, setFriendCount] = useState(0);
     const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
     const [isFollowing, setIsFollowing] = useState(false);
     const [followerCount, setFollowerCount] = useState(0);
     const [friendLoading, setFriendLoading] = useState(false);
     const [followLoading, setFollowLoading] = useState(false);
     const [posts, setPosts] = useState<PostFromServer[]>([]);
     const [pageInfo, setPageInfo] = useState({ page: 1, limit: 10, total: 0 });
     const [postLoading, setPostLoading] = useState(false);

     const params = useParams();
     const id = params?.id;

     useEffect(() => {
          if (id && typeof id === 'string') {
               setUserId(id);
          } else if (typeof window !== 'undefined') {
               const storedData = localStorage.getItem('userInfo');
               const storedUser = storedData ? JSON.parse(storedData) : null;
               if (storedUser?._id) setUserId(storedUser._id);
          }
     }, [id]);

     useEffect(() => {
          if (typeof window !== 'undefined') {
               const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
               setUserInfo(info);
          }
     }, []);

     useEffect(() => {
          if (!userId) return;
          setLoading(true);
          getProfile({
               userId,
               onSuccess: (data: any) => {
                    const { user, relation, followersCount, countFriends, isFollowing } = data.metadata;
                    setUser(user);
                    setRelation(relation as RelationType);
                    setFollowerCount(followersCount || 0);
                    setFriendCount(countFriends || 0);
                    setIsFollowing(isFollowing || false);
                    setLoading(false);
               },
               onError: () => setLoading(false),
          });
     }, [userId]);

     useEffect(() => {
          if (userId) handleGetPost();
     }, [userId]);

     const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          uploadFile({
               type: 'avatar',
               file,
               onSuccess: ({ metadata }) => {
                    const newAvatarUrl = metadata;
                    // alert(newAvatarUrl);
                    // Update local state
                    setUser((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : null));

                    // Update localStorage immediately and notify listeners
                    const stored = localStorage.getItem('userInfo');
                    if (stored) {
                         //alert(newAvatarUrl);
                         const parsed = JSON.parse(stored);
                         alert(parsed);
                         const updatedUserInfo = { ...parsed, avatar: newAvatarUrl };
                         localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                         window.dispatchEvent(new CustomEvent('userInfoUpdated', { detail: updatedUserInfo }));
                         window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: newAvatarUrl }));
                    } else {
                         const base = user || (userId ? { _id: userId, name: '', email: '' } : {});
                         const newUserInfo = { ...base, avatar: newAvatarUrl } as any;
                         localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
                         window.dispatchEvent(new CustomEvent('userInfoUpdated', { detail: newUserInfo }));
                         window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: newAvatarUrl }));
                    }

                    // Reload profile API to get updated data
                    if (userId) {
                         getProfile({
                              userId,
                              onSuccess: (data: any) => {
                                   const { user, relation, followersCount, countFriends, isFollowing } = data.metadata;
                                   setUser(user);
                                   setRelation(relation as RelationType);
                                   setFollowerCount(followersCount || 0);
                                   setFriendCount(countFriends || 0);
                                   setIsFollowing(isFollowing || false);
                              },
                              onError: (err) => console.error('Failed to reload profile:', err),
                         });
                    }
               },
               onError: (err) => console.error('Upload avatar failed:', err),
          });
     }, [userId, user]);

     const handleAddFriend = useCallback(() => {
          if (!userId) return;
          setFriendLoading(true);
          addFriend({ userId, onSuccess: () => setRelation('pending_sent'), onFinally: () => setFriendLoading(false) });
     }, [userId]);

     const handleAcceptFriend = useCallback(() => {
          if (!userId) return;
          setFriendLoading(true);
          acceptFriend({
               userId,
               onSuccess: () => {
                    setRelation('accepted');
                    setFriendCount((p) => p + 1);
               },
               onFinally: () => setFriendLoading(false),
          });
     }, [userId]);

     const handleCancelRequest = useCallback(() => {
          if (!userId) return;
          setFriendLoading(true);
          cancelRequest({ userId, onSuccess: () => setRelation('stranger'), onFinally: () => setFriendLoading(false) });
     }, [userId]);

     const handleUnfriend = useCallback(() => {
          if (!userId || !window.confirm('Are you sure you want to unfriend this person?')) return;
          setFriendLoading(true);
          unFriend({
               userId,
               onSuccess: () => {
                    setRelation('stranger');
                    setFriendCount((p) => Math.max(p - 1, 0));
               },
               onFinally: () => setFriendLoading(false),
          });
     }, [userId]);

     const handleFollow = useCallback(() => {
          if (!userId) return;
          setFollowLoading(true);
          addFollow({
               userId,
               onSuccess: () => {
                    setIsFollowing(true);
                    setFollowerCount((p) => p + 1);
               },
               onFinally: () => setFollowLoading(false),
          });
     }, [userId]);

     const handleUnfollow = useCallback(() => {
          if (!userId) return;
          setFollowLoading(true);
          unFollow({
               userId,
               onSuccess: () => {
                    setIsFollowing(false);
                    setFollowerCount((p) => Math.max(p - 1, 0));
               },
               onFinally: () => setFollowLoading(false),
          });
     }, [userId]);

     const handleGetPost = useCallback(async () => {
          if (!userId) return;
          setPostLoading(true);
          await getPostByUser({
               userId,
               pages: 1,
               limit: 20,
               onSuccess: (data) => {
                    setPosts(data.data);
                    setPageInfo({ page: data.pagination.page, limit: data.pagination.limit, total: data.pagination.totalItems });
               },
               onError: () => void 0,
               onFinally: () => setPostLoading(false),
          });
     }, [userId]);

     return {
          // state
          userId,
          user,
          loading,
          relation,
          friendCount,
          userInfo,
          isFollowing,
          followerCount,
          friendLoading,
          followLoading,
          posts,
          pageInfo,
          postLoading,
          // actions
          handleAvatarChange,
          handleAddFriend,
          handleAcceptFriend,
          handleCancelRequest,
          handleUnfriend,
          handleFollow,
          handleUnfollow,
          handleGetPost,
     };
}


