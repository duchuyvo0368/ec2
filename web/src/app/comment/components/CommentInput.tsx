/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Camera, Send, Smile, Sparkles } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { UserInfo } from "@/app/home/type";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useAvatarUpdate } from "@/app/user/hooks/useAvatarUpdate";
import { useSocket } from "@/app/context/Socket";

const CommentInput: React.FC<{
     newComment: string;
     setNewComment: React.Dispatch<React.SetStateAction<string>>;
     handleCommentSubmit: () => void;
     small?: boolean;
     onReply?: (commentId: string) => void;
     postId?: string;
     isLoading?: boolean;
     onTyping?: (value: string) => void;
}> = ({
     newComment,
     setNewComment,
     handleCommentSubmit,
     small,
     postId,
     isLoading = false,
     onTyping
}) => {
          const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
          const [showEmojiPicker, setShowEmojiPicker] = useState(false);
          const emojiRef = useRef<HTMLDivElement>(null);
          const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
          const { sendTyping, stopTyping } = useSocket();

          useEffect(() => {
               if (typeof window !== "undefined") {
                    const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
                    setUserInfo(info);
               }

               const handleClickOutside = (event: MouseEvent) => {
                    if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                         setShowEmojiPicker(false);
                    }
               };
               document.addEventListener("mousedown", handleClickOutside);
               return () => document.removeEventListener("mousedown", handleClickOutside);
          }, []);

          // Listen for avatar updates
          useAvatarUpdate(setUserInfo);

          const onEmojiClick = (emojiData: EmojiClickData) => {
               const newValue = newComment + emojiData.emoji;
               setNewComment(newValue);
               onTyping?.(newValue);
               setShowEmojiPicker(false);
          };





          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
               // Enter to send, Shift+Enter for newline (not supported in input; for textarea in future)
               if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (newComment.trim() && !isLoading) {
                         handleCommentSubmit();
                         onTyping?.('');
                    }
               }
          };
          useEffect(() => {
               return () => {
                    if (typingTimeoutRef.current) {
                         clearTimeout(typingTimeoutRef.current);
                    }
               };
          }, []);
          const handleTyping = useCallback((value: string) => {
               if (!postId || !userInfo) return;

               if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
               }

               if (value.trim()) {
                    sendTyping(postId, {
                         id: userInfo._id,
                         name: userInfo.name,
                         postId: postId
                    });

                    typingTimeoutRef.current = setTimeout(() => {
                         stopTyping(postId, {
                              id: userInfo._id,
                              name: userInfo.name,
                              postId: postId
                         });
                    }, 2000);
               } else {
                    stopTyping(postId, {
                         id: userInfo._id,
                         name: userInfo.name,
                         postId: postId
                    });
               }
          }, [postId, userInfo, sendTyping, stopTyping]);
          const handleSubmit = (e: React.FormEvent) => {
               e.preventDefault();
               if (newComment.trim() && !isLoading) {
                    if (postId && userInfo) {
                         stopTyping(postId, {
                              id: userInfo._id,
                              name: userInfo.name,
                              postId: postId
                         });
                    }
                    handleCommentSubmit();
               }
          }
          return (
               <div className="relative">
                    <form onSubmit={handleSubmit} className={`flex items-center border-t border-gray-200 bg-white rounded-lg ${small ? "p-1" : "p-2"}`}>
                         <img
                              src={userInfo?.avatar || 'https://hoseiki.vn/wp-content/uploads/2025/03/avatar-mac-dinh-3.jpg'}
                              alt="Avatar"
                              className={`rounded-full object-cover ${small ? "w-6 h-6" : "w-9 h-9"}`}
                         />
                         <div className="flex-1 ml-2 relative">
                              <input
                                   type="text"
                                   placeholder="Write a comment..."
                                   value={newComment}

                                   onKeyDown={handleKeyDown}
                                   onChange={(e) => {
                                        setNewComment(e.target.value);
                                        handleTyping(e.target.value);
                                   }}
                                   disabled={isLoading}
                                   className="w-full bg-gray-100 rounded-full py-2.5 pl-4 pr-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50"
                              />

                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                                   <Sparkles size={20} className='w-5 h-5 rounded-full text-gray-500 hover:text-blue-500 cursor-pointer' />

                                   <div className="relative" ref={emojiRef}>
                                        <Smile
                                             size={20}
                                             className="text-gray-500 cursor-pointer w-5 h-5 rounded-full hover:text-gray-700"
                                             onClick={() => setShowEmojiPicker(prev => !prev)}
                                        />
                                        {showEmojiPicker && (
                                             <div className="absolute bottom-full mb-2 right-0 z-50 shadow-lg rounded-lg overflow-hidden">
                                                  <EmojiPicker
                                                       onEmojiClick={onEmojiClick}
                                                       lazyLoadEmojis
                                                       searchDisabled
                                                       skinTonesDisabled
                                                       height={280}
                                                  />
                                             </div>
                                        )}
                                   </div>

                                   <Camera size={20} className="text-gray-500 cursor-pointer w-5 h-5 rounded-full hover:text-gray-700" />
                                   <button
                                        type="submit"
                                        disabled={!newComment.trim() || isLoading}
                                        className="text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                   >
                                        {isLoading ? (
                                             <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                             <Send size={20} className='w-5 h-5 rounded-full' />
                                        )}
                                   </button>
                              </div>
                         </div>
                    </form>
               </div>
          );
     };

export default CommentInput;
