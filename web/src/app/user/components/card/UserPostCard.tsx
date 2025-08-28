/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import clsx from "clsx";
import { formatDate } from "@/utils";
import { BsGlobeAmericas, BsPeopleFill } from "react-icons/bs";
import { PostCardProps } from "../../api/type";
import PostCommentModal from "@/app/comment/components/PostCommentModal";
import EditPostModal from "./EditPostModal";
import { ChevronLeft, ChevronRight, Eye, MessageCircle, Send, Share2, ThumbsUp } from "lucide-react";
import { FeelType } from "@/app/posts/type";
import { usePostCard } from "../../hooks/usePostCard";

const reactions = [
     { emoji: '👍', label: 'like' },
     { emoji: '❤️', label: 'love' },
     { emoji: '😂', label: 'haha' },
     { emoji: '😮', label: 'wow' },
     { emoji: '😢', label: 'sad' },
     { emoji: '😡', label: 'angry' },
];

const emojiMap: Record<string, string> = {
     like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', angry: '😡'
};

const PostCard: React.FC<PostCardProps> = ({
     userName,
     avatar,
     postId,
     relation,
     title,
     content,
     images = [],
     videos = [],
     feels,
     hashtags,
     feel_count,
     privacy,
     comments,
     views,
     post_link_meta,
     createdAt,
     handleGetPost,
     my_feel
}) => {
     const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

     const {
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
          handleDelete
     } = usePostCard({ postId, feel: feels, feelCount: feel_count, handleGetPost });

     const getPrivacyIcon = (privacyType: string) => {
          switch (privacyType) {
               case "public": return <BsGlobeAmericas className="w-2.5 h-2.5" />;
               case "friend": return <BsPeopleFill className="w-2.5 h-2.5" />;
               default: return null;
          }
     };

     const allMedia = [...images, ...videos];
     const isVideo = (url: string) => /\.(mp4|mov|webm)$/.test(url);

     return (
          <div className="flex justify-center w-full">
               <div className="w-full bg-white rounded-xl p-4 shadow-sm mb-6">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-200">
                         <div className="flex items-start gap-3">
                              <img
                                   src={avatar || '/images/user-image.png'}
                                   alt="avatar"
                                   className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                              />
                              <div>
                                   <div className="flex items-center gap-1 font-semibold text-sm text-gray-900">
                                        {userName}
                                        <VerifiedIcon className="text-blue-500" style={{ width: 15, height: 15 }} />
                                   </div>
                                   <div className="text-xs text-gray-500 flex items-center gap-1">
                                        {formatDate(createdAt)}
                                        {privacy && <span className="ml-1">{getPrivacyIcon(privacy)}</span>}
                                   </div>
                              </div>
                         </div>

                         {relation === "me" && (
                              <div className="flex items-center gap-2">
                                   <button onClick={handleEdit} className="text-gray-500 hover:text-blue-500 transition p-1 rounded-full">
                                        <FiEdit size={16} />
                                   </button>
                                   <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition p-1 rounded-full">
                                        <FiTrash2 size={16} />
                                   </button>
                              </div>
                         )}
                    </div>

                    {/* Title */}
                    {title && <div className="font-bold text-base my-2 text-center">{title}</div>}

                    {/* Content */}
                    <div className="text-sm text-gray-700 whitespace-pre-line mt-2">
                         {content && <div>{content}</div>}

                         {hashtags?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                   {hashtags.map((tag, idx) => (
                                        <span key={idx} className="text-blue-500 font-medium cursor-pointer hover:underline">#{tag}</span>
                                   ))}
                              </div>
                         )}

                            {post_link_meta && (
                                                 <div className="mt-3 overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50 cursor-pointer rounded-lg">
                                                      {post_link_meta.post_link_video ? (
                                                           // Nếu có video → hiển thị iframe
                                                           <div
                                                                className={clsx(
                                                                     "w-full rounded-md overflow-hidden",
                                                                     post_link_meta.type === "tiktok" ? "aspect-[9/16]" : "aspect-video"
                                                                )}
                                                           >
                                                                <iframe
                                                                     src={post_link_meta.post_link_video}
                                                                     className="w-full h-full"
                                                                     frameBorder="0"
                                                                     allow={
                                                                          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                                                     }
                                                                     allowFullScreen
                                                                />
                                                           </div>
                                                      ) : (
                                                           // Nếu không có video → hiển thị ảnh + info
                                                           <>
                                                                {post_link_meta.post_link_image && (
                                                                     <img
                                                                          src={post_link_meta.post_link_image}
                                                                          alt={post_link_meta.post_link_title || "Link preview"}
                                                                          className="w-full h-52 object-cover rounded-t-md"
                                                                     />
                                                                )}
                                                                <div className="p-3">
                                                                     {post_link_meta.post_link_title && (
                                                                          <div className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                                                                               {post_link_meta.post_link_title}
                                                                          </div>
                                                                     )}
                                                                     {post_link_meta.post_link_description && (
                                                                          <div className="text-xs text-gray-600 line-clamp-2 mb-1">
                                                                               {post_link_meta.post_link_description}
                                                                          </div>
                                                                     )}
                                                                     {post_link_meta.post_link_url && (
                                                                          <a
                                                                               href={post_link_meta.post_link_url}
                                                                               target="_blank"
                                                                               rel="noopener noreferrer"
                                                                               className="text-xs text-blue-600 truncate block"
                                                                          >
                                                                               {post_link_meta.post_link_url}
                                                                          </a>
                                                                     )}
                                                                </div>
                                                           </>
                                                      )}
                                                 </div>
                                            )}
                    </div>

                    {/* Media carousel */}
                    {allMedia.length > 0 && (
                         <div className="mt-3">
                              <div className="relative w-full">
                                   {isVideo(allMedia[selectedIndex]) ? (
                                        <video src={allMedia[selectedIndex]} controls className="w-full h-[400px] object-cover rounded-lg" />
                                   ) : (
                                        <img src={allMedia[selectedIndex]} alt={`media-${selectedIndex}`} className="w-full h-[400px] object-cover rounded-lg" />
                                   )}

                                   {allMedia.length > 1 && (
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center p-1 shadow max-w-[280px] bg-white/30 rounded-xl">
                                             <button
                                                  onClick={() => { setSelectedIndex(prev => Math.max(0, prev - 1)); thumbRef.current?.scrollBy({ left: -200, behavior: 'smooth' }); }}
                                                  disabled={selectedIndex === 0}
                                                  className="bg-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-40"
                                             ><ChevronLeft size={18} /></button>

                                             <div ref={thumbRef} className="flex gap-2 overflow-x-auto no-scrollbar mx-2">
                                                  {allMedia.map((media, idx) => (
                                                       <div
                                                            key={idx}
                                                            onClick={() => setSelectedIndex(idx)}
                                                            className={clsx('flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition', selectedIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent')}
                                                       >
                                                            {isVideo(media) ? <video src={media} className="w-10 h-10 object-cover" /> : <img src={media} className="w-10 h-10 object-cover" />}
                                                       </div>
                                                  ))}
                                             </div>

                                             <button
                                                  onClick={() => { setSelectedIndex(prev => Math.min(allMedia.length - 1, prev + 1)); thumbRef.current?.scrollBy({ left: 200, behavior: 'smooth' }); }}
                                                  disabled={selectedIndex === allMedia.length - 1}
                                                  className="bg-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-40"
                                             ><ChevronRight size={18} /></button>
                                        </div>
                                   )}
                              </div>
                         </div>
                    )}

                    {/* Stats + actions */}
                    <div className="border-t border-gray-200 mt-2 pt-2 text-sm text-gray-600">
                         <div className="flex justify-between items-center px-2">
                              <div className="flex items-center gap-1 cursor-pointer text-gray-500">
                                   <div className="flex -space-x-1">
                                        {Object.entries(feelCounts || {})
                                             .filter(([_, count]) => count && count > 0)
                                             .sort((a, b) => b[1] - a[1])
                                             .map(([type], idx) => (
                                                  <span key={idx} className="w-4 h-4 text-xs inline-block rounded-full bg-white border border-white">
                                                       {emojiMap[type]}
                                                  </span>
                                             ))}
                                   </div>
                                   <span className="ml-1 text-gray-500 text-sm">{totalFeelCount}</span>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                   <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{views || 0}</div>
                                   <div className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{comments || 0}</div>
                              </div>
                         </div>

                         <hr className="border-gray-200 my-2" />

                         <div className="flex justify-around text-sm font-medium text-gray-700">
                              <div ref={btnRef} className="relative">
                                   <button
                                        onClick={() => setShowReactions(prev => !prev)}
                                        className={clsx("flex items-center gap-1 px-3 py-1 rounded-md transition", userFeel ? "text-blue-600 hover:bg-blue-50" : "text-gray-600 hover:bg-gray-100")}
                                   >
                                        <span className="text-lg">{userFeel ? emojiMap[userFeel] : <ThumbsUp className="w-4 h-4 text-gray-500" />}</span>
                                        <span>{userFeel ? userFeel.charAt(0).toUpperCase() + userFeel.slice(1) : 'Like'}</span>
                                   </button>

                                   {showReactions && (
                                        <div className="absolute -top-14 left-2/6 -translate-x-1/5 flex gap-2 bg-white border border-gray-200 rounded-full shadow px-3 py-2 z-50 animate-fadeIn whitespace-nowrap overflow-x-auto">
                                             {reactions.map((r, i) => (
                                                  <span
                                                       key={i}
                                                       title={r.label}
                                                       className="text-2xl cursor-pointer hover:scale-125 transition-transform"
                                                       onClick={() => { handleFeelClick(r.label as FeelType); setShowReactions(false); }}
                                                  >{r.emoji}</span>
                                             ))}
                                        </div>
                                   )}
                              </div>

                              {[{ icon: MessageCircle, label: 'Comment' }, { icon: Send, label: 'Send' }, { icon: Share2, label: 'Share' }].map((btn, idx) => (
                                   <button
                                        key={idx}
                                        className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100 transition text-gray-600"
                                        onClick={() => { if (btn.label === 'Comment') setShowCommentModal(true); }}
                                   >
                                        <btn.icon className="w-4 h-4" /> {btn.label}
                                   </button>
                              ))}
                         </div>
                    </div>
               </div>

               {/* Edit Modal */}
               {showEditModal && postBeingEdited && (
                    <EditPostModal
                         open={showEditModal}
                         onClose={() => setShowEditModal(false)}
                         postData={postBeingEdited}
                         handleGetPost={() => { handleGetPost(); setShowEditModal(false); }}
                         userInfo={userInfo} />
               )}

               {/* Comment Modal */}
               {showCommentModal && (
                    <PostCommentModal
                         open={showCommentModal}
                         onClose={() => setShowCommentModal(false)}
                         userInfo={userInfo}
                         postUserInfo={{ name: userName, avatar: avatar || '/images/user-image.png' }}
                         postData={{
                              id: postId,
                              content: content || '',
                              images,
                              videos,
                              feel: feels || [],
                              hashtags: hashtags ?? [],
                              comments: [],
                              privacy,
                              feelCount: feelCounts || {},
                              views: views || 0,
                              createdAt,
                              comment_count: comments || 0,
                              post_link_meta: post_link_meta || null,
                              userFeel,
                              my_feel,
                         }}
                         onFeelUpdate={(newFeelCounts, newFeel) => {
                              // Cập nhật khi có thay đổi cảm xúc từ modal comment
                         }}
                    />
               )}
          </div>
     );
};

export default PostCard;
