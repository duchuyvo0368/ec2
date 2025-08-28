/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Globe } from "lucide-react";
import { Loader2, SendHorizonal } from 'lucide-react';
import { EditPostModalProps } from "../../api/type";
import { useEditPost } from "../../hooks/useEditPost";
import clsx from "clsx";

const EditPostModal: React.FC<EditPostModalProps> = ({
     open,
     onClose,
     userInfo,
     postData,
     handleGetPost,
}) => {
     if (!open) return null;

     const {
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
          linkMeta,
          existingImages,
          setExistingImages,
          existingVideos,
          setExistingVideos,
          textareaRef,
          fileRefs,
          handleFileChange,
          triggerFileInput,
          handlePost,
          highlightHashtagsAndMentions,
          handleChange,
          handleMentionSelect,
          mentionSuggestions,
          showSuggestions,
     } = useEditPost(open, postData, userInfo, handleGetPost, onClose);













     return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
               <div className="relative bg-white w-full max-w-xl rounded-xl shadow-lg max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="relative text-center p-4 border-b border-neutral-200 bg-white">
                         <p className="text-base font-bold text-[#2E90FA]">Edit Post</p>
                         <button
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
                              onClick={onClose}
                         >
                              ×
                         </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto px-8 py-4">
                         <div className="flex items-center gap-2 min-h-16">
                              <img src={userInfo.avatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                   <p className="font-semibold">{userInfo.name}</p>
                                   <div className="flex items-center text-sm text-gray-500 gap-2">
                                        <Globe className="w-4 h-4" />
                                        <select
                                             value={privacy}
                                             onChange={(e) => setPrivacy(e.target.value as 'public' | 'friend')}
                                             className="bg-transparent text-sm outline-none cursor-pointer"
                                        >
                                             <option value="public">Public</option>
                                             <option value="friend">Friend</option>
                                        </select>
                                   </div>
                              </div>
                         </div>

                         <input
                              type="text"
                              placeholder="Title your article"
                              className="mt-4 w-full text-lg font-semibold text-gray-800 text-center placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                              value={postTitle}
                              onChange={(e) => setPostTitle(e.target.value)}
                         />

                         <div className="relative w-full mt-2">
                              <div
                                   className="absolute top-0 left-0 w-full h-full whitespace-pre-wrap text-base text-gray-900 pointer-events-none p-2"
                                   dangerouslySetInnerHTML={{ __html: highlightHashtagsAndMentions(postContent) }}
                              />
                              <textarea
                                   ref={textareaRef}
                                   placeholder="What's on your mind?"
                                   className="w-full resize-none outline-none text-base placeholder-gray-500 bg-transparent relative z-10 p-2"
                                   rows={4}
                                   value={postContent}
                                   onChange={handleChange}
                                   style={{ color: "transparent", caretColor: "black" }}
                              />

                              {showSuggestions && mentionSuggestions.length > 0 && (
                                   <ul className="absolute z-20 mt-1 left-2 top-full bg-white border border-gray-300 rounded shadow-md w-64 max-h-48 overflow-y-auto">
                                        {mentionSuggestions.map(user => (
                                             <li
                                                  key={user.id}
                                                  onClick={() => handleMentionSelect(user)}
                                                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
                                             >
                                                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                                                  <span>{user.name}</span>
                                             </li>
                                        ))}
                                   </ul>
                              )}
                         </div>


                         {linkLoading && (
                              <p className="text-sm text-gray-500">Loading...</p>
                         )}

                         {linkMeta && (
                              <div className="mt-3 overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50 cursor-pointer rounded-lg">
                                   {linkMeta.post_link_video ? (
                                        // Nếu có video → hiển thị iframe
                                        <div
                                             className={clsx(
                                                  "w-full rounded-md overflow-hidden",
                                                  linkMeta.type === "tiktok" ? "aspect-[9/16]" : "aspect-video"
                                             )}
                                        >
                                             <iframe
                                                  src={linkMeta.post_link_video}
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
                                                  {linkMeta.post_link_image && (
                                                  <img
                                                            src={linkMeta.post_link_image}
                                                            alt={linkMeta.post_link_title || "Link preview"}
                                                       className="w-full h-52 object-cover rounded-t-md"
                                                  />
                                             )}
                                             <div className="p-3">
                                                       {linkMeta.post_link_title && (
                                                       <div className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                                                                 {linkMeta.post_link_title}
                                                       </div>
                                                  )}
                                                       {linkMeta.post_link_description && (
                                                       <div className="text-xs text-gray-600 line-clamp-2 mb-1">
                                                                 {linkMeta.post_link_description}
                                                       </div>
                                                  )}
                                                       {linkMeta.post_link_url && (
                                                       <a
                                                                 href={linkMeta.post_link_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 truncate block"
                                                       >
                                                            {linkMeta.post_link_url}
                                                       </a>
                                                  )}
                                             </div>
                                        </>
                                   )}
                              </div>
                         )}

                         {/* Preview Images: existing + selected */}
                         {(existingImages.length > 0 || selectedImageFiles.length > 0) && (
                              <div className="mt-4">
                                   <h4 className="text-sm font-semibold text-gray-600 mb-2">Photos</h4>
                                   <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
                                        {existingImages.map((url, idx) => (
                                             <div
                                                  key={`exist-img-${idx}`}
                                                  className="relative group bg-white/60 border border-dashed border-[#d9d9d9] rounded-lg p-1"
                                             >
                                                  <img
                                                       src={url}
                                                       alt={`existing-img-${idx}`}
                                                       className="w-full rounded-md max-h-40 object-cover"
                                                  />
                                                  <button
                                                       onClick={() =>
                                                            setExistingImages(prev => prev.filter((_, i) => i !== idx))
                                                       }
                                                       className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                       title="Remove existing image"
                                                  >
                                                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                       </svg>
                                                  </button>
                                             </div>
                                        ))}
                                        {selectedImageFiles.map((file, idx) => (
                                             <div
                                                  key={`selected-img-${idx}`}
                                                  className="relative group bg-white/60 border border-dashed border-[#d9d9d9] rounded-lg p-1"
                                             >
                                                  <img
                                                       src={URL.createObjectURL(file)}
                                                       alt={`selected-img-${idx}`}
                                                       className="w-full rounded-md max-h-40 object-cover"
                                                  />
                                                  <button
                                                       onClick={() =>
                                                            setSelectedImageFiles(prev => prev.filter((_, i) => i !== idx))
                                                       }
                                                       className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                       title="Remove selected image"
                                                  >
                                                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                       </svg>
                                                  </button>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}

                         {/* Preview Videos: existing + selected */}
                         {(existingVideos.length > 0 || selectedVideoFiles.length > 0) && (
                              <div className="mt-4">
                                   <h4 className="text-sm font-semibold text-gray-600 mb-2">Videos</h4>
                                   <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
                                        {existingVideos.map((url, idx) => (
                                             <div
                                                  key={`exist-vid-${idx}`}
                                                  className="relative group bg-white/60 border border-dashed border-[#d9d9d9] rounded-lg p-1"
                                             >
                                                  <video src={url} controls className="w-full rounded-md max-h-40" />
                                                  <button
                                                       onClick={() =>
                                                            setExistingVideos(prev => prev.filter((_, i) => i !== idx))
                                                       }
                                                       className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                       title="Remove existing video"
                                                  >
                                                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                       </svg>
                                                  </button>
                                             </div>
                                        ))}
                                        {selectedVideoFiles.map((file, idx) => (
                                             <div
                                                  key={`selected-vid-${idx}`}
                                                  className="relative group bg-white/60 border border-dashed border-[#d9d9d9] rounded-lg p-1"
                                             >
                                                  <video src={URL.createObjectURL(file)} controls className="w-full rounded-md max-h-40" />
                                                  <button
                                                       onClick={() =>
                                                            setSelectedVideoFiles(prev => prev.filter((_, i) => i !== idx))
                                                       }
                                                       className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                       title="Remove selected video"
                                                  >
                                                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                       </svg>
                                                  </button>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}

                         {/* Action Buttons */}
                         <div className="grid grid-cols-4 gap-5 justify-items-center mt-6">
                              {[
                                   { label: "image", icon: "🖼️" },
                                   { label: "video", icon: "🎥" },
                                   { label: "livestream", icon: "📡" },
                                   { label: "mp3", icon: "🎵" },
                                   { label: "document", icon: "📄" },
                                   { label: "tag", icon: "🏷️" },
                                   { label: "donate", icon: "🤝" },
                                   { label: "poll", icon: "📊" },
                                   { label: "event", icon: "📅" },
                                   { label: "action", icon: "🔥" },
                                   { label: "address", icon: "🏠" },
                                   { label: "location", icon: "📍" },
                              ].map((item, idx) => (
                                   <div
                                        key={idx}
                                        onClick={() =>
                                             item.label === "image" || item.label === "video"
                                                  ? triggerFileInput(item.label as 'image' | 'video')
                                                  : null
                                        }
                                        className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-500 cursor-pointer w-16"
                                   >
                                        <div className="text-2xl">{item.icon}</div>
                                        <span className="mt-1 capitalize text-center">{item.label}</span>
                                   </div>
                              ))}
                         </div>

                         {/* Submit button */}
                         <div className="mt-10">
                              <button
                                   type="button"
                                   onClick={handlePost}
                                   disabled={isUploading}
                                   className={`w-full relative flex items-center justify-center gap-2 py-2 px-4 font-semibold rounded-xl transition-all duration-300 shadow-lg ${isUploading
                                        ? 'bg-gradient-to-r from-blue-300 to-blue-500 cursor-not-allowed opacity-80'
                                        : 'bg-gradient-to-r from-[#2E90FA] to-[#1B74E4] hover:from-[#1B74E4] hover:to-[#1065d8] text-white'
                                        }`}
                              >
                                   {isUploading ? (
                                        <>
                                             <Loader2 className="w-5 h-5 animate-spin text-white" />
                                             <span className="text-white">Loading...</span>
                                        </>
                                   ) : (
                                        <>
                                             <SendHorizonal className="w-5 h-5 text-white" />
                                             <span>Update Post</span>
                                        </>
                                   )}
                              </button>
                         </div>
                    </div>

                    {/* Hidden Inputs */}
                    <input
                         type="file"
                         accept="image/*"
                         multiple
                         ref={fileRefs.image}
                         className="hidden"
                         onChange={handleFileChange('image')}
                    />
                    <input
                         type="file"
                         accept="video/*"
                         multiple
                         ref={fileRefs.video}
                         className="hidden"
                         onChange={handleFileChange('video')}
                    />
               </div>
          </div>
     );
};

export default EditPostModal;