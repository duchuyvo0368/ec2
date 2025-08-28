/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Globe, Loader2, SendHorizonal, X } from "lucide-react";
import { CreatePostModalProps } from "../type";
import { useCreatePost } from "../hooks/useCreatePost";

const ACTION_ICONS = [
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
];

const CreatePostModal: React.FC<CreatePostModalProps> = ({
     open,
     onClose,
     userInfo,
     onPostCreated,
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
          selectedVideoFiles,
          isUploading,
          linkLoading,
          linkMeta,
          showSuggestions,
          mentionSuggestions,
          fileRefs,
          handleFileChange,
          triggerFileInput,
          handlePost,
          handleCancelPost,
          highlightHashtags,
          handleChange,
          handleMentionSelect,
     } = useCreatePost(onClose, userInfo, onPostCreated);

     return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
               <div className="relative bg-white w-full max-w-xl rounded-xl shadow-lg max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="relative text-center p-4 border-b border-neutral-200 bg-white">
                         <p className="text-base font-bold text-[#2E90FA]">Create Post</p>
                         <button
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
                              onClick={onClose}
                         >
                              ×
                         </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto px-8 py-4">
                         {/* User Info */}
                         <div className="flex items-center gap-2 min-h-16">
                              <img
                                   src={userInfo.avatar}
                                   alt="User Avatar"
                                   className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                   <p className="font-semibold">{userInfo.name}</p>
                                   <div className="flex items-center text-sm text-gray-500 gap-2">
                                        <Globe className="w-4 h-4" />
                                        <select
                                             value={privacy}
                                             onChange={(e) =>
                                                  setPrivacy(e.target.value as "public" | "friends")
                                             }
                                             className="bg-transparent text-sm outline-none cursor-pointer"
                                        >
                                             <option value="public">Public</option>
                                             <option value="friends">Friends</option>
                                        </select>
                                   </div>
                              </div>
                         </div>

                         {/* Title */}
                         <input
                              type="text"
                              placeholder="Title your article"
                              className="mt-4 w-full text-lg font-semibold text-gray-800 text-center placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                              value={postTitle}
                              onChange={(e) => setPostTitle(e.target.value)}
                         />

                         {/* Content */}
                         <div className="relative w-full mt-2">
                              <div
                                   className="absolute top-0 left-0 w-full h-full whitespace-pre-wrap text-base text-gray-900 pointer-events-none p-2"
                                   dangerouslySetInnerHTML={{
                                        __html: highlightHashtags(postContent),
                                   }}
                              />
                              <textarea
                                   placeholder="What's on your mind?"
                                   className="w-full resize-none outline-none text-base placeholder-gray-500 bg-transparent relative z-10 p-2"
                                   rows={4}
                                   value={postContent}
                                   onChange={(e) => {
                                        setPostContent(e.target.value);
                                        handleChange(e);
                                   }}
                                   style={{
                                        color: "transparent",
                                        caretColor: "black",
                                   }}
                              />
                              {showSuggestions && mentionSuggestions.length > 0 && (
                                   <ul className="absolute z-20 mt-1 left-2 top-full bg-white border border-gray-300 rounded shadow-md w-64 max-h-48 overflow-y-auto">
                                        {mentionSuggestions.map((user) => (
                                             <li
                                                  key={user.id}
                                                  onClick={() => handleMentionSelect(user)}
                                                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                             >
                                                  <div className="flex items-center gap-2">
                                                       <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className="w-6 h-6 rounded-full object-cover"
                                                       />
                                                       <span>{user.name}</span>
                                                  </div>
                                             </li>
                                        ))}
                                   </ul>
                              )}
                         </div>

                         {/* Link Preview */}
                         {linkLoading && <p className="text-sm text-gray-500">Loading...</p>}
                         {linkMeta && (
                              <div className="border border-gray-300 rounded p-2 mt-2 flex gap-3 items-center">
                                   {linkMeta.post_link_image && (
                                        <img
                                             src={linkMeta.post_link_image}
                                             alt="link preview"
                                             className="w-24 h-24 object-cover rounded"
                                        />
                                   )}
                                   <div className="flex-1">
                                        <h4 className="font-semibold text-sm line-clamp-1">
                                             {linkMeta.post_link_title}
                                        </h4>
                                        <p className="text-xs text-gray-600 line-clamp-2">
                                             {linkMeta.post_link_description}
                                        </p>
                                        <a
                                             href={linkMeta.post_link_url}
                                             className="text-blue-500 text-xs break-all inline-block mt-1"
                                             target="_blank"
                                             rel="noopener noreferrer"
                                        >
                                             {linkMeta.post_link_url}
                                        </a>
                                   </div>
                              </div>
                         )}

                         {/* Preview Images */}
                         {selectedImageFiles.length > 0 && (
                              <FilePreview
                                   title="Photo selected"
                                   files={selectedImageFiles}
                                   onRemove={(idx) =>
                                        setSelectedImageFiles((prev) => prev.filter((_, i) => i !== idx))
                                   }
                              />
                         )}

                         {/* Preview Videos */}
                         {selectedVideoFiles.length > 0 && (
                              <FilePreview
                                   title="Video selected"
                                   files={selectedVideoFiles}
                                   isVideo
                                   onRemove={(idx) =>
                                        setSelectedVideoFiles((prev) => prev.filter((_, i) => i !== idx))
                                   }
                              />
                         )}

                         {/* Action Buttons */}
                         <div className="grid grid-cols-4 gap-5 justify-items-center mt-6">
                              {ACTION_ICONS.map((item, idx) => (
                                   <div
                                        key={idx}
                                        onClick={() =>
                                             item.label === "image" || item.label === "video"
                                                  ? triggerFileInput(item.label as "image" | "video")
                                                  : null
                                        }
                                        className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-500 cursor-pointer w-16"
                                   >
                                        <div className="text-2xl">{item.icon}</div>
                                        <span className="mt-1 capitalize text-center">{item.label}</span>
                                   </div>
                              ))}
                         </div>

                         {/* Post Actions */}
                         <div className="flex gap-3 mt-10">
                              <button
                                   onClick={handleCancelPost}
                                   disabled={isUploading}
                                   className="flex-1 py-2 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
                              >
                                   Cancel
                              </button>
                              <button
                                   onClick={handlePost}
                                   disabled={isUploading}
                                   className={`flex-1 relative flex items-center justify-center gap-2 py-2 px-4 font-semibold rounded-xl transition-all duration-300 shadow-lg
                ${isUploading
                                             ? "bg-gradient-to-r from-blue-300 to-blue-500 cursor-not-allowed opacity-80"
                                             : "bg-gradient-to-r from-[#2E90FA] to-[#1B74E4] hover:from-[#1B74E4] hover:to-[#1065d8] text-white"
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
                                             <span>Create Post</span>
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
                         onChange={handleFileChange("image")}
                    />
                    <input
                         type="file"
                         accept="video/*"
                         multiple
                         ref={fileRefs.video}
                         className="hidden"
                         onChange={handleFileChange("video")}
                    />
               </div>
          </div>
     );
};

export default CreatePostModal;

/* ---------------- File Preview Component ---------------- */
const FilePreview = ({
     title,
     files,
     onRemove,
     isVideo = false,
}: {
     title: string;
     files: File[];
     onRemove: (idx: number) => void;
     isVideo?: boolean;
}) => (
     <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">{title}</h4>
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
               {files.map((file, idx) => (
                    <div
                         key={idx}
                         className="relative group bg-white/60 border border-dashed border-[#d9d9d9] rounded-lg p-1"
                    >
                         {isVideo ? (
                              <video
                                   src={URL.createObjectURL(file)}
                                   controls
                                   className="w-full rounded-md max-h-40"
                              />
                         ) : (
                              <img
                                   src={URL.createObjectURL(file)}
                                   alt={`preview-${idx}`}
                                   className="w-full rounded-md max-h-40 object-cover"
                              />
                         )}
                         <button
                              onClick={() => onRemove(idx)}
                              className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                              title="Remove"
                         >
                              <X className="w-4 h-4" />
                         </button>
                    </div>
               ))}
          </div>
     </div>
);
