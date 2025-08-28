/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect } from 'react';
import { Heart, Share2, MoreHorizontal, MessageCircle, ChevronRight, ChevronLeft, LoaderCircle, Send, Eye, ThumbsUp } from 'lucide-react';
import CommentItem from './Comment';
import CommentInput from './CommentInput';
import TypingIndicator from './TypingIndicator';
import { CommentType, UserInfo } from '@/app/home/type';
import { PostCommentModalProps } from '../type';
import { formatDate } from '@/utils';
import { useSocket } from '@/app/context/Socket';

import { usePostComments } from '../hooks/usePostComments';

const PostCommentModal: React.FC<PostCommentModalProps> = ({ open, onClose, postData, userInfo, postUserInfo, onFeelUpdate, onCommentCountUpdate }) => {
     // Local state
     const [newComment, setNewComment] = useState('');
     const [selectedIndex, setSelectedIndex] = useState(0);
     const [showReactions, setShowReactions] = useState(false);
     const [showModal, setShowModal] = useState(false);
     const thumbRef = useRef<HTMLDivElement>(null);
     const images = postData?.images || [];

     // Get comment count from postData
     const commentCount = postData?.comment_count || 0;

     // Get initial feel data from postData
     const initialFeelCounts = postData?.feelCount || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
     const initialUserFeel = postData?.userFeel || postData?.my_feel || '';

     // Use the updated hook
     const {
          comments,
          isLoading: loadingComments,
          isSubmitting,
          fetchComments,
          submitComment,
          handleDeleteComment,
          addReplyToComment,
          handleFeelClick: hookHandleFeelClick,
     } = usePostComments({
          postId: postData?.id || '',
          my_feel: initialUserFeel,
          feelCount: initialFeelCounts,
          onCommentCountChange: (count) => {
               if (onCommentCountUpdate) {
                    if (typeof count === 'function') {
                         onCommentCountUpdate(count(commentCount));
                    } else {
                         onCommentCountUpdate(count);
                    }
               }
          },
          onFeelUpdate: (newFeel, newFeelCounts) => {
               // Call onFeelUpdate callback to sync with parent component
               if (onFeelUpdate) {
                    onFeelUpdate(newFeelCounts, []);
               }
          }
     });

     // Socket for typing indicators
     const { joinPost, leavePost, typingUsers, stopTyping } = useSocket();

     // Fetch comments when modal opens
     useEffect(() => {
          if (open && postData?.id) {
               fetchComments();
          }
     }, [open, postData?.id, fetchComments]);

     // Join/leave post room khi modal mở/đóng
     useEffect(() => {
          if (open && postData?.id) {
               joinPost(postData.id);
          } else if (!open && postData?.id) {

               if (userInfo) {
                    stopTyping(postData.id, {
                         id: userInfo._id,
                         name: userInfo.name,
                         postId: postData.id
                    });
               }
               leavePost(postData.id);
          }
     }, [open, postData?.id, joinPost, leavePost, stopTyping, userInfo]);

     // Handle comment submit
     const handleCommentSubmit = () => {
          if (newComment.trim()) {
               submitComment(newComment.trim());
               setNewComment('');
               // Comment count is already handled by the hook
          }
     };

     // Handle feel click
     const handleFeelClick = async (type: string) => {
          setShowReactions(false);

          // Call the hook's handleFeelClick to update feel via API
          await hookHandleFeelClick(type as any);

          // onFeelUpdate is now handled by the hook's callback
     };

     // Handle new comment (for replies)
     const handleNewComment = (comment: CommentType) => {
          addReplyToComment(comment);
          // Comment count is already handled by the hook
     };

     // Handle delete comment
     const handleDeleteCommentWithCount = async (commentId: string) => {
          await handleDeleteComment(commentId);
          // Comment count is already handled by the hook
     };

     const reactions = [
          { emoji: '👍', label: 'Like' },
          { emoji: '❤️', label: 'Love' },
          { emoji: '😂', label: 'Haha' },
          { emoji: '😮', label: 'Wow' },
          { emoji: '😢', label: 'Sad' },
          { emoji: '😡', label: 'Angry' },
     ];
     const btnRef = useRef<HTMLDivElement | null>(null);




     if (!open || !postData) return null;

     return (
          <div className="fixed inset-0 bg-neutral-60/60 flex justify-center items-center z-50">
               <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="relative p-4 border-b border-gray-200 flex items-center justify-center">
                         <h2 className="font-bold text-center text-black text-base">
                              Post Comments
                         </h2>
                         <button onClick={onClose} className="absolute right-4 text-gray-500 hover:text-gray-800">✕</button>
                    </div>

                    {/* Post content */}
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1">
                         <div className="p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                   <img src={postUserInfo?.avatar || userInfo.avatar} alt="User Avatar" width={35} height={35} className="rounded-full w-9 h-9" />
                                   <div className="ml-2">
                                        <p className="font-semibold text-sm text-gray-800">{postUserInfo?.name || userInfo.name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(postData.createdAt)}</p>
                                   </div>
                              </div>
                              <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"><MoreHorizontal size={15} /></button>
                         </div>
                         {/* Post content text */}
                         {postData.content && (
                              <div className="px-4 pb-2 text-sm text-gray-800 whitespace-pre-line">
                                   {postData.content}
                              </div>
                         )}

                         {/* Link preview (meta link) */}

                         {postData.post_link_meta && (
                              <a
                                   href={postData.post_link_meta.post_link_url}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="block mx-4 mb-4 border border-gray-200 bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition"
                              >
                                   {postData.post_link_meta?.post_link_image && (
                                        <img
                                             src={postData.post_link_meta?.post_link_image}
                                             alt="Link preview"
                                             className="w-full h-48 object-cover"
                                        />
                                   )}
                                   <div className="p-3">
                                        <p className="font-semibold text-gray-800 text-sm">
                                             {postData.post_link_meta?.post_link_title}
                                        </p>
                                        <p className="text-xs text-gray-600 line-clamp-2">
                                             {postData.post_link_meta?.post_link_description}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                             {new URL(postData.post_link_meta?.post_link_url || "").hostname}
                                        </p>
                                   </div>
                              </a>
                         )}


                         {/* Ảnh chính + thumbnail */}
                         {images.length > 0 && (
                              <div className="p-4 relative w-full">
                                   {/* Ảnh chính */}
                                   <img
                                        src={images[selectedIndex]}
                                        alt={`Main post image`}
                                        className="w-full max-h-[400px] object-cover rounded-lg"
                                   />

                                   {/* Chỉ hiện khi có nhiều hơn 1 ảnh */}
                                   {images.length > 1 && (
                                        <div className="custom-indicator max-w-[230px] flex items-center justify-start p-1 absolute left-[50%] translate-x-[-50%] bottom-0 bg-gray-100/50 rounded-lg z-[21]">
                                             {/* Nút qua trái */}
                                             <button
                                                  onClick={() => {
                                                       setSelectedIndex((prev) => Math.max(0, prev - 1));
                                                       thumbRef.current?.scrollBy({ left: -200, behavior: "smooth" });
                                                  }}
                                                  disabled={selectedIndex === 0}
                                                  className="bg-white/80 hover:bg-white text-gray-800 shadow-lg rounded-full w-6 h-6 flex items-center justify-center hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                             >
                                                  <ChevronLeft size={25} />
                                             </button>

                                             {/* Thumbnails */}
                                             <div
                                                  ref={thumbRef}
                                                  className="flex gap-2 overflow-x-auto no-scrollbar mx-2"
                                             >
                                                  {images.map((img, index) => (
                                                       <img
                                                            key={index}
                                                            src={img}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            onClick={() => setSelectedIndex(index)}
                                                            className={`w-10 h-10 rounded-lg object-cover flex-shrink-0 cursor-pointer transition-all border-2 ${selectedIndex === index
                                                                 ? "border-blue-400 scale-105"
                                                                 : "border-transparent"
                                                                 }`}
                                                       />
                                                  ))}
                                             </div>

                                             {/* Nút qua phải */}
                                             <button
                                                  onClick={() => {
                                                       setSelectedIndex((prev) => Math.min(images.length - 1, prev + 1));
                                                       thumbRef.current?.scrollBy({ left: 200, behavior: "smooth" });
                                                  }}
                                                  disabled={selectedIndex === images.length - 1}
                                                  className="bg-white/80 hover:bg-white text-gray-800 shadow-lg rounded-full w-6 h-6 flex items-center justify-center hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                             >
                                                  <ChevronRight size={25} strokeWidth={2.5} />
                                             </button>
                                        </div>
                                   )}
                              </div>
                         )}


                         {/* Like / Comment / Share info */}
                         <div className="px-4 py-2 flex justify-between items-center text-sm text-gray-600">
                              {/* Cảm xúc */}
                              <div className="flex items-center">
                                   <div className="flex -space-x-2">
                                        {Object.entries(initialFeelCounts || {})
                                             .filter(([_, count]) => count && (count as number) > 0)
                                             .map(([type], idx) => {
                                                  let emoji = '';
                                                  switch (type) {
                                                       case 'like':
                                                            emoji = '👍';
                                                            break;
                                                       case 'love':
                                                            emoji = '❤️';
                                                            break;
                                                       case 'haha':
                                                            emoji = '😂';
                                                            break;
                                                       case 'wow':
                                                            emoji = '😮';
                                                            break;
                                                       case 'sad':
                                                            emoji = '😢';
                                                            break;
                                                       case 'angry':
                                                            emoji = '😡';
                                                            break;
                                                  }
                                                  return (
                                                       <span
                                                            key={type}
                                                            onClick={() => handleFeelClick(type)}
                                                            className="inline-block w-5 h-5 text-sm bg-white rounded-full border border-white flex items-center justify-center text-center shadow-sm"
                                                       >
                                                            {emoji}
                                                       </span>
                                                  );
                                             })}
                                   </div>

                                   {/* Tổng số cảm xúc */}
                                   <span className="ml-2 text-gray-500 text-sm">
                                        {Object.values(initialFeelCounts || {}).reduce((acc: number, v: any) => acc + (v || 0), 0)}
                                   </span>
                              </div>

                              {/* Comment & Share */}
                              <span>{commentCount} comment • 2 share</span>
                         </div>


                         <div className="  border-gray-200 pt- text-sm text-gray-600">



                              <hr className="border-gray-200 my-2" />

                              {/* Hàng 2: các nút */}
                              <div className="flex justify-around text-sm font-medium text-gray-700">
                                   {/* Nút cảm xúc với hover hiển thị reactions */}
                                   <div ref={btnRef} className="relative">
                                        <button
                                             onClick={() => setShowReactions((prev) => !prev)}
                                             className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${initialUserFeel ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
                                                  }`}
                                        >
                                             {/* Hiển thị icon theo userFeel */}
                                             <span className="text-lg">
                                                  {initialUserFeel === 'like' && '👍'}
                                                  {initialUserFeel === 'love' && '❤️'}
                                                  {initialUserFeel === 'haha' && '😂'}
                                                  {initialUserFeel === 'wow' && '😮'}
                                                  {initialUserFeel === 'sad' && '😢'}
                                                  {initialUserFeel === 'angry' && '😡'}
                                                  {initialUserFeel === '' && <ThumbsUp className="w-4 h-4 text-gray-500" />}
                                             </span>

                                             {/* Text hiển thị */}
                                             <span>
                                                  {initialUserFeel
                                                       ? initialUserFeel.charAt(0).toUpperCase() + initialUserFeel.slice(1) // Like / Love / Haha
                                                       : 'Like'}
                                             </span>
                                        </button>

                                        {showReactions && (
                                             <div className="absolute -top-14 left-2/6 -translate-x-1/5 flex gap-2 bg-white border border-gray-200 rounded-full shadow px-3 py-2 z-50 animate-fadeIn whitespace-nowrap overflow-x-auto">
                                                  {reactions.map((r, i) => (
                                                       <span
                                                            key={i}
                                                            title={r.label}
                                                            className="text-2xl cursor-pointer hover:scale-125 transition-transform"
                                                            onClick={() => {
                                                                 handleFeelClick(r.label.toLowerCase() as 'like' | 'love' | 'haha' |
                                                                      'wow' | 'sad' | 'angry' | '');
                                                                 setShowReactions(false);
                                                            }}
                                                       >
                                                            {r.emoji}
                                                       </span>
                                                  ))}
                                             </div>
                                        )}
                                   </div>

                                   {[
                                        { icon: MessageCircle, label: 'Comment' },
                                        { icon: Send, label: 'Send' },
                                        { icon: Share2, label: 'Share' },
                                   ].map((btn, idx) => (
                                        <button
                                             key={idx}
                                             className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100 transition text-gray-600"
                                             onClick={() => {
                                                  if (btn.label === 'Comment') setShowModal(true);
                                             }}
                                        >
                                             <btn.icon className="w-4 h-4" /> {btn.label}
                                        </button>
                                   ))}

                              </div>

                         </div>

                         {/* Comment list */}
                         <div className="p-4 space-y-4">
                              {loadingComments ? (
                                   <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-center">
                                             <LoaderCircle className="animate-spin text-gray-500" size={28} />
                                        </div>
                                        {[...Array(3)].map((_, idx) => (
                                             <div key={`skeleton-${idx}`} className="flex items-start gap-3 animate-pulse">
                                                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                                  <div className="flex-1 space-y-2">
                                                       <div className="w-1/3 h-3 bg-gray-200 rounded" />
                                                       <div className="w-full h-3 bg-gray-200 rounded" />
                                                       <div className="w-2/3 h-3 bg-gray-200 rounded" />
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              ) : comments.length > 0 ? (
                                   comments.map((c, idx) => (
                                        <div
                                             key={c._id ?? `comment-${idx}`}
                                             className="flex-1"
                                        >
                                             <CommentItem
                                                  comment={c}
                                                  postData={postData}
                                                  onReply={handleNewComment}
                                                  userInfo={userInfo}
                                                  onDelete={handleDeleteCommentWithCount}
                                             />
                                        </div>
                                   ))

                              ) : (
                                   <p className="text-gray-500 text-sm italic">No comments yet.</p>
                              )}

                              <div className={`h-8 transition-opacity duration-200 ${typingUsers.get(postData.id)?.size ? "opacity-100" : "opacity-0"}`}>
                                   <TypingIndicator
                                        users={Array.from(typingUsers.get(postData.id) || [])}
                                        isVisible={!!typingUsers.get(postData.id)?.size}
                                        currentUserName={userInfo?.name}
                                   />
                              </div>



                         </div>
                    </div>

                    {/* Comment input */}
                    <CommentInput
                         newComment={newComment}
                         setNewComment={setNewComment}
                         handleCommentSubmit={handleCommentSubmit}
                         postId={postData.id}
                         isLoading={isSubmitting}
                    />
               </div>
          </div>
     );
};

export default PostCommentModal;
