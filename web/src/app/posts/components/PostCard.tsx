



/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import { BsGlobeAmericas, BsPeopleFill } from 'react-icons/bs';
import { ThumbsUp, MessageCircle, Send, Share2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

import { PostCardProps, FeelType } from '../type';
import PostCommentModal from '@/app/comment/components/PostCommentModal';
import { formatDate } from '@/utils';
import { usePostCard } from '../hooks/usePostCard';
import Link from 'next/link';
import ShareDropdown from './ShareDropdown';
import type { UserInfo as ModalUserInfo } from '@/app/home/type';

const PostCard: React.FC<PostCardProps> = ({
     userName,
     avatar,
     postId,
     userId,
     title,
     content,
     images = [],
     videos = [],
     feelCount,
     my_feel,
     hashtags,
     privacy,
     views,
     post_link_meta,
     createdAt,
     comments,
}) => {
     const [currentCommentCount, setCurrentCommentCount] = React.useState(comments || 0);
     console.log("my_feel",my_feel)
     React.useEffect(() => {
          setCurrentCommentCount(comments || 0);
     }, [comments]);

     const allMedia = React.useMemo(() => [...images, ...videos], [images, videos]);

     const {
          userInfo,
          userFeel,
          showModal,
          showShare,
          feelCounts,
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
     } = usePostCard({ postId, feelCount, my_feel, media: allMedia });

     const reactions = [
          { emoji: '👍', label: 'like' },
          { emoji: '❤️', label: 'love' },
          { emoji: '😂', label: 'haha' },
          { emoji: '😮', label: 'wow' },
          { emoji: '😢', label: 'sad' },
          { emoji: '😡', label: 'angry' },
     ];


     const getPrivacyIcon = (privacyType: string) => {
          switch (privacyType) {
               case 'public': return <BsGlobeAmericas className="w-3 h-3" />;
               case 'friend': return <BsPeopleFill className="w-3 h-3" />;
               default: return null;
          }
     };

     const isVideo = (url: string) => url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm');

     const normalizedUserInfo: ModalUserInfo = React.useMemo(() => ({
          _id: userInfo._id || '',
          name: userInfo.name || '',
          avatar: userInfo.avatar || ''
     }), [userInfo]);

     const memoPostData = React.useMemo(() => ({
          id: postId,
          content: content || '',
          images,
          videos,
          hashtags: hashtags ?? [],
          comments: [],
          privacy,
          feelCount: feelCounts,
          views: views || 0,
          createdAt,
          comment_count: currentCommentCount,
          post_link_meta: post_link_meta || null,
          userFeel,
     }), [postId, content, images, videos, hashtags, privacy, feelCounts, views, createdAt, currentCommentCount, post_link_meta, userFeel]);

     const handleFeelUpdate = React.useCallback((newFeelCounts: Record<string, number>) => {
          setFeelCounts(newFeelCounts);
     }, [setFeelCounts]);

     const handleCommentCountUpdate = React.useCallback((newCount: number) => {
          setCurrentCommentCount(newCount);
     }, []);

     const postUserInfoMemo = React.useMemo(() => ({
          name: userName,
          avatar: avatar || '/images/user-image.png'
     }), [userName, avatar]);

     return (
          <div className="flex justify-center w-full">
               <div className="w-full max-w-2xl bg-white rounded-md p-4 shadow-md mb-3">

                    {/* Header */}
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                         <Link href={`/profile/${userId}`}>
                              <img
                                   src={avatar || '/images/user-image.png'}
                                   className="w-10 h-10 rounded-full border border-gray-200 object-cover cursor-pointer"
                              />
                         </Link>
                         <div>
                              <div className="flex items-center gap-1 font-semibold text-sm text-gray-900">
                                   {userName} <VerifiedIcon className="text-blue-500" style={{ width: '15px', height: '15px' }} />
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                   {formatDate(createdAt)} {privacy && <span className="ml-1">{getPrivacyIcon(privacy)}</span>}
                              </div>
                         </div>
                    </div>

                    {/* Title */}
                    {title && <div className="font-bold text-base my-2 text-center">{title}</div>}

                    {/* Content */}
                    {content && <div className="text-sm text-gray-700 whitespace-pre-line mt-2">{content}</div>}

                    {/* Hashtags */}
                    {hashtags && hashtags.length > 0 && (
                         <div className="mt-2 flex flex-wrap gap-2">
                              {hashtags.map((tag, idx) => <span key={idx} className="text-blue-500 font-medium cursor-pointer hover:underline">#{tag}</span>)}
                         </div>
                    )}

                    {/* Media */}

                    {allMedia.length > 0 && (
                         <div className="mt-3 relative w-full">
                              {isVideo(allMedia[selectedIndex]) ? (
                                   <video
                                        src={allMedia[selectedIndex]}
                                        controls
                                        className="w-full h-[400px] object-cover rounded-lg"
                                   />
                              ) : (
                                   <img
                                        src={allMedia[selectedIndex]}
                                        className="w-full h-[400px] object-cover rounded-lg"
                                   />
                              )}

                              {allMedia.length > 1 && (
                                   <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-transparent backdrop-blur-sm rounded-xl flex items-center p-1 shadow max-w-[280px]">
                                        <button
                                             onClick={() => {
                                                  setSelectedIndex((prev) => Math.max(0, prev - 1));
                                                  thumbRef.current?.scrollBy({ left: -200, behavior: "smooth" });
                                             }}
                                             disabled={selectedIndex === 0}
                                             className="bg-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-40"
                                        >
                                             <ChevronLeft size={18} />
                                        </button>
                                        <div
                                             ref={thumbRef}
                                             className="flex gap-2 overflow-x-auto no-scrollbar mx-2"
                                        >
                                             {allMedia.map((media, index) => (
                                                  <div
                                                       key={index}
                                                       onClick={() => setSelectedIndex(index)}
                                                       className={clsx(
                                                            "flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition",
                                                            selectedIndex === index
                                                                 ? "border-blue-500 scale-105"
                                                                 : "border-transparent"
                                                       )}
                                                  >
                                                       {isVideo(media) ? (
                                                            <video src={media} className="w-10 h-10 object-cover" />
                                                       ) : (
                                                            <img src={media} className="w-10 h-10 object-cover" />
                                                       )}
                                                  </div>
                                             ))}
                                        </div>
                                        <button
                                             onClick={() => {
                                                  setSelectedIndex((prev) =>
                                                       Math.min(allMedia.length - 1, prev + 1)
                                                  );
                                                  thumbRef.current?.scrollBy({ left: 200, behavior: "smooth" });
                                             }}
                                             disabled={selectedIndex === allMedia.length - 1}
                                             className="bg-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-40"
                                        >
                                             <ChevronRight size={18} />
                                        </button>
                                   </div>
                              )}
                         </div>
                    )}

                    {/* Link Metadata Preview */}
                    {post_link_meta && (
                         <div className="mt-3 overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50 cursor-pointer rounded-lg">
                              {post_link_meta.post_link_video ? (
                                   <div
                                        className={clsx(
                                             "w-full rounded-md overflow-hidden",
                                             post_link_meta.type === "tiktok" ? "aspect-[9/16]" : "aspect-video"
                                        )}
                                   >
                                        <iframe
                                             src={post_link_meta.post_link_video}
                                             className="w-full h-full"
                                             frameBorder="1"
                                             allow={
                                                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                             }
                                             allowFullScreen
                                        />
                                   </div>
                              ) : (
                                   <>
                                        {post_link_meta.post_link_image && (
                                             <img
                                                  src={post_link_meta.post_link_image}
                                                  alt={post_link_meta.post_link_title || "Link preview"}
                                                  className="w-full h-70 object-cover rounded-t-md"
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

                    {/* Reactions & Stats */}
                    <div className="border-t border-gray-200 mt-2 pt-2 text-sm text-gray-600">
                         <div className="flex justify-between items-center px-2">
                              <div className="flex items-center gap-1 cursor-pointer text-gray-500">
                                   <div className="flex -space-x-1">
                                        {Object.entries(feelCounts).filter(([_, c]) => c > 0).sort((a, b) => b[1] - a[1]).map(([type], idx) => {
                                             const emojiMap: Record<string, string> = { like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', angry: '😡' };
                                             return <span key={idx} className="w-4 h-4 text-xs inline-block rounded-full bg-white border border-white">{emojiMap[type]}</span>;
                                        })}
                                   </div>
                                   {totalFeelCount > 0 && (
                                        <span className="ml-1 text-gray-500 text-sm">{totalFeelCount}</span>
                                   )}

                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                   <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{views || 0}</div>
                                   <div className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{currentCommentCount}</div>
                              </div>
                         </div>

                         <hr className="border-gray-200 my-2" />

                         <div className="flex justify-around text-sm font-medium text-gray-700">
                              <div ref={btnRef} className="relative">
                                   <button onClick={() => setShowReactions(prev => !prev)} className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${userFeel ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}>
                                        <span className="text-lg">
                                             {userFeel === 'like' && '👍'}
                                             {userFeel === 'love' && '❤️'}
                                             {userFeel === 'haha' && '😂'}
                                             {userFeel === 'wow' && '😮'}
                                             {userFeel === 'sad' && '😢'}
                                             {userFeel === 'angry' && '😡'}
                                             {userFeel === '' && <ThumbsUp className="w-4 h-4 text-gray-500" />}
                                        </span>
                                        <span>{userFeel ? userFeel.charAt(0).toUpperCase() + userFeel.slice(1) : 'Like'}</span>
                                   </button>

                                   {showReactions && (
                                        <div className="absolute -top-14 left-2/6 -translate-x-1/5 flex gap-2 bg-white border border-gray-200 rounded-full shadow px-3 py-2 z-50 animate-fadeIn whitespace-nowrap overflow-x-auto">
                                             {reactions.map((r, i) => (
                                                  <span key={i} title={r.label} className="text-2xl cursor-pointer hover:scale-125 transition-transform" onClick={() => { handleFeelClick(r.label as FeelType); setShowReactions(false); }}>{r.emoji}</span>
                                             ))}
                                        </div>
                                   )}
                              </div>

                              {[
                                   { icon: MessageCircle, label: 'Comment' },
                                   { icon: Send, label: 'Send' },
                                   { icon: Share2, label: 'Share' }
                              ].map((btn, idx) => (
                                   <button
                                        key={idx}
                                        className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100 transition text-gray-600"
                                        onClick={() => {
                                             if (btn.label === 'Comment') setShowModal(true);
                                             if (btn.label === 'Share') setShowShare(prev => !prev);
                                        }}
                                   >
                                        <btn.icon className="w-4 h-4" /> {btn.label}
                                   </button>


                              ))}

                         </div>
                    </div>
               </div>

               {showModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                         <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
                         <PostCommentModal
                              open={showModal}
                              onClose={() => setShowModal(false)}
                              userInfo={normalizedUserInfo}
                              postUserInfo={postUserInfoMemo}
                              postData={memoPostData}
                              onFeelUpdate={handleFeelUpdate}
                              onCommentCountUpdate={handleCommentCountUpdate}
                         />
                    </div>
               )}

               {showShare && (
                    <div className="relative">
                         <ShareDropdown onClose={() => setShowShare(false)} />
                    </div>
               )}
          </div>
     );
};

export default React.memo(PostCard);
