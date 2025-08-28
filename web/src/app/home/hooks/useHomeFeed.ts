/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPostUser } from '../home.service';
import { UserInfo } from '../type';
import { PostFromServer } from '@/app/posts/type';

const POSTS_PER_PAGE = 2;

export function useHomeFeed() {
     const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
     const [showModal, setShowModal] = useState(false);
     const [posts, setPosts] = useState<PostFromServer[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [page, setPage] = useState(1);
     const [totalPages, setTotalPages] = useState<number>(0);
     const [hasMore, setHasMore] = useState(true);

     useEffect(() => {
          if (typeof window !== 'undefined') {
               const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
               setUserInfo(info);
          }
     }, []);

     const loadMoreData = useCallback(() => {
          if (loading) return;
          if (!hasMore) return;
          setPage((prev) => prev + 1);
     }, [loading, hasMore]);

     useEffect(() => {
          const fetchPosts = async () => {
               setLoading(true);
               setError(null);
               getPostUser({
                    limit: POSTS_PER_PAGE,
                    page,
                    onSuccess: (data) => {
                         setPosts((prev) => {
                              const merged = [...prev, ...data.data];
                              const uniquePosts = Array.from(new Map(merged.map((p) => [p._id, p])).values()).sort(
                                   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                              );
                              return uniquePosts;
                         });

                         const apiTotalPages = data.pagination?.totalPages ?? 0;
                         setTotalPages(apiTotalPages);

                         if (apiTotalPages > 0) {
                              setHasMore(page < apiTotalPages);
                         } else {
                              // Fallback by page size when pagination is missing
                              setHasMore((data.data?.length || 0) === POSTS_PER_PAGE);
                         }

                         setLoading(false);
                    },
                    onError: () => {
                         setLoading(false);
                         setError(null);
                    },
               });
          };
          fetchPosts();
     }, [page]);

     const hasMoreData = hasMore;

     const handlePostCreated = useCallback((newPost: any) => {
          setPosts((prev) => [newPost, ...prev]);
     }, []);

     return {
          userInfo,
          showModal,
          setShowModal,
          posts,
          loading,
          error,
          page,
          totalPages,
          loadMoreData,
          hasMoreData,
          handlePostCreated,
     };
}


