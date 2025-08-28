/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditPostModalProps, PostLinkMeta } from '../api/type';
import { searchFriendUsers, uploadFileInChunks, uploadPost } from '../api/user.service';
import toast from 'react-hot-toast';
import { splitContentAndHashtagsAndFriends } from '@/utils';

export function useEditPost(open: boolean, postData: EditPostModalProps['postData'], userInfo: any, handleGetPost: () => void, onClose: () => void) {
	const [postTitle, setPostTitle] = useState('');
	const [postContent, setPostContent] = useState('');
	const [privacy, setPrivacy] = useState<'public' | 'friend'>('public');
	const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
	const [selectedVideoFiles, setSelectedVideoFiles] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [linkLoading, setLinkLoading] = useState(false);
	const [linkMeta, setLinkMeta] = useState<PostLinkMeta | null>(null);
	const [mentionQuery, setMentionQuery] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [mentionSuggestions, setMentionSuggestions] = useState<any[]>([]);
	const [selectedFriends, setSelectedFriends] = useState<any[]>([]);
	const [existingImages, setExistingImages] = useState<string[]>([]);
	const [existingVideos, setExistingVideos] = useState<string[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileRefs = { image: useRef<HTMLInputElement>(null), video: useRef<HTMLInputElement>(null) };

	useEffect(() => {
		if (open && postData) {
			setPostTitle(postData.title || '');
			setPostContent(postData.content || '');
			setPrivacy(postData.privacy === 'friend' ? 'friend' : 'public');
			setExistingImages(postData.images || []);
			setExistingVideos(postData.videos || []);
			setSelectedImageFiles([]);
			setSelectedVideoFiles([]);
			setLinkMeta(postData.post_link_meta || null);
			setSelectedFriends(postData.friends_tagged || []);
			if (postData.hashtags && Array.isArray(postData.hashtags)) {
				const hashtagsString = postData.hashtags.map((tag: string) => `#${tag}`).join(' ');
				const fullContent = hashtagsString + ' ' + (postData.content || '');
				setPostContent(fullContent.trim());
			} else {
				setPostContent(postData.content || '');
			}
		} else if (!open) {
			setPostTitle('');
			setPostContent('');
			setPrivacy('public');
			setExistingImages([]);
			setExistingVideos([]);
			setSelectedImageFiles([]);
			setSelectedVideoFiles([]);
			setLinkMeta(null);
			setSelectedFriends([]);
			setMentionSuggestions([]);
			setShowSuggestions(false);
		}
	}, [postData, open]);

	const handleFileChange = useCallback((type: 'image' | 'video') => (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (type === 'image' && selectedVideoFiles.length > 0) {
			toast.error("Can't upload both images and videos");
			return;
		}
		if (type === 'video' && selectedImageFiles.length > 0) {
			toast.error("Can't upload both images and videos");
			return;
		}
		if (type === 'image') setSelectedImageFiles((prev) => [...prev, ...files]);
		else setSelectedVideoFiles((prev) => [...prev, ...files]);
	}, [selectedImageFiles.length, selectedVideoFiles.length]);

	const triggerFileInput = useCallback((type: 'image' | 'video') => {
		fileRefs[type].current?.click();
	}, []);

	const handlePost = useCallback(async () => {
		try {
			setIsUploading(true);
			const [imageUrls, videoUrls] = await Promise.all([
				Promise.all(selectedImageFiles.map((file) => uploadFileInChunks(file).then((res) => res.location))),
				Promise.all(selectedVideoFiles.map((file) => uploadFileInChunks(file).then((res) => res.location))),
			]);
			const { content: cleanContent, hashtags } = splitContentAndHashtagsAndFriends(postContent);
			if (!postData?._id) throw new Error('postData._id is missing');
			await uploadPost({
				postId: postData._id,
				userId: userInfo._id,
				title: postTitle,
				content: cleanContent,
				privacy,
				images: [...existingImages, ...imageUrls],
				videos: [...existingVideos, ...videoUrls],
				hashtags,
				post_link_meta: linkMeta,
				friends_tagged: selectedFriends.map((f) => f.id),
				post_count_feels: { post_count_feels: 0, post_count_comments: 0, post_count_views: 0 },
				feel: {},
				feelCount: {},
			});
			toast.success('Update post successfully!');
			handleGetPost();
			onClose();
		} catch (error) {
			console.error('Update post failed:', error);
			toast.error('Failed to update post');
		} finally {
			setIsUploading(false);
		}
	}, [existingImages, existingVideos, handleGetPost, linkMeta, onClose, postContent, postData?._id, postTitle, privacy, selectedFriends, selectedImageFiles, selectedVideoFiles, userInfo?._id]);

	const highlightHashtagsAndMentions = useCallback((text: string) => {
		if (!text) return '';
		return text
			.replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>')
			.replace(/@(\w+)/g, '<span class="text-green-600 font-semibold">@$1</span>');
	}, []);

	const handleChange = useCallback(async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const val = e.target.value;
		setPostContent(val);
		const cursorPos = e.target.selectionStart;
		const textBeforeCursor = val.slice(0, cursorPos);
		const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
		if (mentionMatch) {
			const query = mentionMatch[1];
			setMentionQuery(query);
			setShowSuggestions(true);
			const results = await searchFriendUsers({ name: query });
			setMentionSuggestions(results);
		} else {
			setShowSuggestions(false);
			setMentionSuggestions([]);
		}
	}, []);

	const handleMentionSelect = useCallback((user: { id: string; name: string }) => {
		const cursorPos = textareaRef.current?.selectionStart || postContent.length;
		const beforeCursor = postContent.slice(0, cursorPos);
		const afterCursor = postContent.slice(cursorPos);
		const newBeforeCursor = beforeCursor.replace(/@(\w*)$/, `@${user.name} `);
		setPostContent(newBeforeCursor + afterCursor);
		setShowSuggestions(false);
		setMentionSuggestions([]);
		setTimeout(() => {
			if (textareaRef.current) {
				const pos = newBeforeCursor.length;
				textareaRef.current.focus();
				textareaRef.current.setSelectionRange(pos, pos);
			}
		}, 0);
	}, [postContent]);

	return {
		// expose state
		postTitle,
		setPostTitle,
		postContent,
		setPostContent,
		privacy,
		setPrivacy,
		selectedImageFiles,
		setSelectedImageFiles,
		selectedVideoFiles,
		setSelectedVideoFiles,
		isUploading,
		linkLoading,
		setLinkLoading,
		linkMeta,
		setLinkMeta,
		mentionQuery,
		showSuggestions,
		mentionSuggestions,
		setMentionSuggestions,
		selectedFriends,
		setSelectedFriends,
		existingImages,
		setExistingImages,
		existingVideos,
		setExistingVideos,
		textareaRef,
		fileRefs,
		// actions
		handleFileChange,
		triggerFileInput,
		handlePost,
		highlightHashtagsAndMentions,
		handleChange,
		handleMentionSelect,
	};
}


