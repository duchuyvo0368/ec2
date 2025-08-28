/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
     abortMultipartUpload,
     createPost,
     deleteObject,
     extractLinkMetadata,
     searchFriendUsers,
     uploadFileInChunks,
} from '../post.service';
import { PostLinkMeta } from '../type';
import { splitContentAndHashtagsAndFriends } from '@/utils';
import { UserInfo } from '@/app/home/type';

export function useCreatePost(
     onClose: () => void,
     userInfo: UserInfo,
     onPostCreated: (post: any) => void,
) {
     const [postTitle, setPostTitle] = useState('');
     const [postContent, setPostContent] = useState('');
     const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');

     const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
     const [selectedVideoFiles, setSelectedVideoFiles] = useState<File[]>([]);
     const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
     const [uploadedVideoUrls, setUploadedVideoUrls] = useState<string[]>([]);

     const [isUploading, setIsUploading] = useState(false);
     const [linkLoading, setLinkLoading] = useState(false);
     const [linkMeta, setLinkMeta] = useState<PostLinkMeta | null>(null);

     const [mentionQuery, setMentionQuery] = useState('');
     const [showSuggestions, setShowSuggestions] = useState(false);
     const [mentionSuggestions, setMentionSuggestions] = useState<any[]>([]);
     const [selectedFriends, setSelectedFriends] = useState<any[]>([]);

     const fileRefs = {
          image: useRef<HTMLInputElement>(null),
          video: useRef<HTMLInputElement>(null),
     };

     const pendingUploads = useRef<{ uploadId: string; key: string }[]>([]);

     
     const handleFileChange = useCallback(
          (type: 'image' | 'video') => async (e: React.ChangeEvent<HTMLInputElement>) => {
               const files = Array.from(e.target.files || []);
               if (files.length === 0) return;

               // rule: không mix ảnh + video
               if (type === 'image' && selectedVideoFiles.length > 0)
                    return toast.error("Can't upload both images and videos");
               if (type === 'video' && selectedImageFiles.length > 0)
                    return toast.error("Can't upload both images and videos");

               if (type === 'image') {
                    setSelectedImageFiles((prev) => [...prev, ...files]);
                    uploadFileInChunks(files, undefined, (info) => {
                         pendingUploads.current.push(info);
                    })
                         .then((urls) => {
                              setUploadedImageUrls((prev) => [...prev, ...urls]);
                         })
                         .catch(() => toast.error('Image upload failed'));
               } else {
                    setSelectedVideoFiles((prev) => [...prev, ...files]);
                    uploadFileInChunks(files, undefined, (info) => {
                         pendingUploads.current.push(info);
                    })
                         .then((urls) => {
                              setUploadedVideoUrls((prev) => [...prev, ...urls]);
                         })
                         .catch(() => toast.error('Video upload failed'));
               }
          },
          [selectedImageFiles.length, selectedVideoFiles.length],
     );

     const triggerFileInput = useCallback(
          (type: 'image' | 'video') => fileRefs[type].current?.click(),
          [],
     );

     const handleCancelPost = useCallback(async () => {
          try {
        
               if (pendingUploads.current.length > 0) {
                    await abortMultipartUpload(pendingUploads.current);
                    pendingUploads.current = [];
               }

              
               const allUrls = [...uploadedImageUrls, ...uploadedVideoUrls];
               if (allUrls.length > 0) {
                    await Promise.all(
                         allUrls.map(async (url) => {
                              const key = decodeURIComponent(
                                   new URL(url).pathname.replace(/^\/+/, "") // lấy key từ URL
                              );
                              return deleteObject(key);
                         })
                    );
               }

               setUploadedImageUrls([]);
               setUploadedVideoUrls([]);

               toast.success("Upload canceled, files aborted & deleted");
               setIsUploading(false);
               onClose();
          } catch (err) {
               console.error("Cancel failed", err);
               toast.error("Failed to cancel upload properly");
          }
     }, [onClose, uploadedImageUrls, uploadedVideoUrls]);

     
     const handlePost = useCallback(async () => {
          try {
               setIsUploading(true);

               const { content: cleanContent, hashtags } =
                    splitContentAndHashtagsAndFriends(postContent);

               await createPost({
                    data: {
                         title: postTitle,
                         content: cleanContent,
                         privacy,
                         userId: userInfo._id,
                         images: uploadedImageUrls,
                         videos: uploadedVideoUrls,
                         hashtags,
                         post_link_meta: linkMeta,
                         friends_tagged: selectedFriends.map((u: { _id: any }) => String(u._id)),
                         post_count_feels: {
                              post_count_feels: 0,
                              post_count_comments: 0,
                              post_count_views: 0,
                         },
                    },
                    onSuccess: (newPost) => {
                         toast.success('Post created successfully!');
                         onPostCreated(newPost);
                         onClose();
                    },
                    onError: (error) => toast.error(`Failed to create post: ${error}`),
               });
          } catch (error) {
               console.error('Upload failed:', error);
               toast.error('Error creating post');
          } finally {
               setIsUploading(false);
               pendingUploads.current = [];
          }
     }, [
          linkMeta,
          onClose,
          onPostCreated,
          postContent,
          postTitle,
          privacy,
          selectedFriends,
          uploadedImageUrls,
          uploadedVideoUrls,
          userInfo?._id,
     ]);

     // detect link meta
     useEffect(() => {
          const match = postContent.match(/(https?:\/\/[^\s]+)/);
          const url = match?.[0];
          if (!url) {
               setLinkMeta(null);
               return;
          }
          if (linkMeta?.post_link_url === url) return;

          setLinkLoading(true);
          extractLinkMetadata({
               url,
               onSuccess: (meta: PostLinkMeta) => {
                    setLinkMeta(meta);
                    if (!postTitle) setPostTitle(meta.post_link_title ?? '');
                    setLinkLoading(false);
               },
               onError: () => {
                    setLinkMeta(null);
                    setLinkLoading(false);
               },
          });
     }, [postContent]);

     const highlightHashtags = useCallback((text: string) => {
          const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return escaped
               .replace(/#[\w\u00C0-\u1EF9]+/g, (tag) => `<span class="text-blue-500 font-medium">${tag}</span>`)
               .replace(
                    /@[\w\u00C0-\u1EF9]+(?: [\w\u00C0-\u1EF9]+)*/g,
                    (tag) => `<span class="text-blue-500 font-medium">${tag}</span>`,
               );
     }, []);

    
     const handleChange = useCallback(async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;
          setPostContent(value);

          const cursorPosition = e.target.selectionStart;
          const beforeCursor = value.slice(0, cursorPosition);
          const atMatch = beforeCursor.match(/@(\w*)$/);
          if (!atMatch) {
               setShowSuggestions(false);
               setMentionSuggestions([]);
               return;
          }

          const mentionKeyword = atMatch[1];
          if (!mentionKeyword) {
               setShowSuggestions(false);
               setMentionSuggestions([]);
               return;
          }

          try {
               const users = await searchFriendUsers({ name: mentionKeyword });
               const mappedUsers = users.map((u: any) => ({ ...u, _id: u._id || u.id }));
               setMentionSuggestions(mappedUsers);
               setShowSuggestions(mappedUsers.length > 0);
          } catch (err) {
               console.error('Search error:', err);
               setMentionSuggestions([]);
               setShowSuggestions(false);
          }
     }, []);

     const handleMentionSelect = useCallback(
          (user: UserInfo) => {
               const newContent = postContent.replace(/@[\p{L}0-9_-]*$/u, `@${user.name}`);
               setPostContent(newContent);
               setShowSuggestions(false);
               setMentionQuery('');
               setSelectedFriends((prev) =>
                    prev.find((u) => u._id === user._id) ? prev : [...prev, user],
               );
          },
          [postContent],
     );

     return {
          postTitle,
          setPostTitle,
          postContent,
          setPostContent,
          privacy,
          setPrivacy,
          selectedImageFiles,
          selectedVideoFiles,
          uploadedImageUrls,
          uploadedVideoUrls,
          isUploading,
          linkLoading,
          linkMeta,
          mentionQuery,
          showSuggestions,
          mentionSuggestions,
          selectedFriends,
          fileRefs,
          handleFileChange,
          triggerFileInput,
          handlePost,
          highlightHashtags,
          handleChange,
          handleCancelPost,
          handleMentionSelect,
     };
}
