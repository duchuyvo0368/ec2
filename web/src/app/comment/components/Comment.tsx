/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react";
import { CommentType } from "@/app/home/type";
import { formatDate } from "@/utils";
import { PostData } from "../type";
import { Send, MoreHorizontal, Trash2 } from "lucide-react";
import { replyComment, deleteComment } from "../comment.service";
import { UserInfo } from "@/app/home/type";
import { useUserProfile } from "@/app/user/hooks/useUserProfile";

const CommentItem = ({
     comment,
     postData,
     onReply,
     userInfo,
     onDelete,
}: {
     comment: CommentType;
     postData: PostData;
     userInfo: UserInfo;
     onReply?: (newCmt: CommentType) => void;
     onDelete?: (commentId: string) => void;
}) => {
     const getCommentUserId = () => {
          if (comment.user) {
               return comment.user._id;
          }

          if (comment.comment_user_id && typeof comment.comment_user_id === 'object') {
               return comment.comment_user_id._id;
          }

          if (typeof comment.comment_user_id === 'string') {
               return comment.comment_user_id;
          }

          return null;
     };

     const commentUserId = getCommentUserId();

     const { data: userProfileData } = useUserProfile({
          userId: commentUserId || undefined,
          enabled: !!commentUserId && !comment.user && typeof comment.comment_user_id === 'string'
     });

     const getCommentUserInfo = () => {
          // Ưu tiên 1: Nếu comment có user data trực tiếp (từ API response)
          if (comment.user) {
               return comment.user;
          }

          // Ưu tiên 2: Nếu comment_user_id là object (có thông tin user)
          if (comment.comment_user_id && typeof comment.comment_user_id === 'object') {
               return comment.comment_user_id;
          }

          // Ưu tiên 3: Nếu comment_user_id là string ID và là current user
          if (typeof comment.comment_user_id === 'string' && comment.comment_user_id === userInfo._id) {
               return userInfo;
          }

          // Ưu tiên 4: Lấy từ API profile
          if (userProfileData) {
               return {
                    _id: userProfileData._id,
                    name: userProfileData.name,
                    avatar: userProfileData.avatar
               };
          }

          // Nếu không có thông tin user, trả về null (sẽ hiển thị "User")
          return null;
     };

     const commentUser = getCommentUserInfo();
     const [showReplyInput, setShowReplyInput] = useState(false);
     const [replyContent, setReplyContent] = useState("");
     const [showChildren, setShowChildren] = useState(false);
     const [showOptions, setShowOptions] = useState(false);
     const [isDeleting, setIsDeleting] = useState(false);
     const optionsRef = useRef<HTMLDivElement>(null);

     // Kiểm tra xem user hiện tại có phải là người viết comment không
     const isCommentOwner = commentUserId === userInfo._id;

     // Đóng dropdown khi click ra ngoài
     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                    setShowOptions(false);
               }
          };

          document.addEventListener('mousedown', handleClickOutside);
          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
          };
     }, []);

     const handleReplyClick = () => {
          setShowReplyInput((prev) => !prev);
     };

     const handleSendReply = async (commentId: string) => {
          if (!replyContent.trim()) return;

          const tempReply: CommentType = {
               _id: `temp_${Math.random().toString(36).substr(2, 9)}`,
               comment_post_id: postData.id,
               comment_user_id: {
                    _id: userInfo._id,
                    name: userInfo.name,
                    avatar: userInfo.avatar,
               },
               comment_content: replyContent,
               comment_parent_id: commentId,
               createdAt: new Date().toISOString(),
               children: [],
               replies: [],
          };

          // Clear input ngay lập tức
          setReplyContent("");
          setShowReplyInput(false);

          // Thêm reply vào UI ngay lập tức
          onReply && onReply(tempReply);

          // Gọi API để lưu reply (background)
          try {
               await replyComment({
                    commentPostId: postData.id,
                    commentUserId: userInfo._id,
                    commentParentId: commentId,
                    commentContent: replyContent,
                    onSuccess: (data) => console.log("Reply saved", data),
                    onError: (err) => console.log(err),
               });
          } catch (error) {
               console.error("Failed to save reply:", error);
          }
     };

     const handleDeleteComment = async () => {
          if (!isCommentOwner) return;

          setIsDeleting(true);
          setShowOptions(false);

          // Xóa comment ngay lập tức trong UI
          onDelete && onDelete(comment._id);

          try {
               await deleteComment({
                    commentId: comment._id,
                    onSuccess: (data) => {
                         console.log("Comment deleted successfully", data);
                    },
                    onError: (err) => {
                         console.error("Failed to delete comment:", err);
                         // Nếu xóa thất bại, thêm lại comment vào UI
                         // Có thể cần thêm logic để restore comment
                    },
                    onFinally: () => {
                         setIsDeleting(false);
                    }
               });
          } catch (error) {
               console.error("Error deleting comment:", error);
               setIsDeleting(false);
          }
     };

     return (
          <div className="flex items-start relative group">
               {/* Avatar */}
               <img
                    src={commentUser?.avatar || 'https://hoseiki.vn/wp-content/uploads/2025/03/avatar-mac-dinh-3.jpg'}
                    alt={commentUser?.name || 'User'}
                    className="w-8 h-8 rounded-full mt-1 relative z-10"
                    onError={(e) => {
                         e.currentTarget.src = 'https://hoseiki.vn/wp-content/uploads/2025/03/avatar-mac-dinh-3.jpg';
                    }}
               />

               {/* Comment Content */}
               <div className="flex flex-col items-start w-full ml-2">
                    <div className="bg-gray-100 rounded-xl px-2 py-1 relative group">
                         <p className="font-semibold text-xs text-gray-800">
                              {commentUser?.name || 'User'}
                         </p>
                         <p className="text-xs text-gray-700">{comment.comment_content}</p>
                         {/* Loading indicator cho comment đang được lưu */}


                         {/* Nút options (3 chấm) sát bên phải comment bubble */}
                         {isCommentOwner && (
                              <div ref={optionsRef} className="absolute -right-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button
                                        onClick={() => setShowOptions(!showOptions)}
                                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                   >
                                        <MoreHorizontal size={12} className="text-gray-500" />
                                   </button>

                                   {/* Dropdown menu */}
                                   {showOptions && (
                                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                                             <button
                                                  onClick={handleDeleteComment}
                                                  disabled={isDeleting}
                                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                                             >
                                                  <Trash2 size={14} />
                                                  {isDeleting ? 'Deleting...' : 'Delete'}
                                             </button>
                                        </div>
                                   )}
                              </div>
                         )}
                    </div>

                    {comment.sticker && <p className="text-2xl mt-0.5">{comment.sticker}</p>}

                    <div className="flex items-center gap-2 mt-0.5 ml-2 text-[10px] font-medium text-gray-500">
                         <span className="text-gray-400 font-normal">
                              {formatDate(comment.createdAt)}
                         </span>
                         <span className="cursor-pointer hover:text-blue-500">Like</span>
                         <span
                              className="cursor-pointer hover:text-blue-500"
                              onClick={handleReplyClick}
                         >
                              Reply
                         </span>
                    </div>

                    {showReplyInput && (
                         <div className="flex items-center mt-1 ml-2 w-full space-x-2">
                              <img
                                   src={userInfo.avatar}
                                   alt="Avatar"
                                   className="w-6 h-6 rounded-full"
                              />
                              <div className="relative flex-1">
                                   <input
                                        type="text"
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Write a reply..."
                                        className="w-full border border-gray-300 rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                                   />
                                   <button
                                        type="button"
                                        onClick={() => handleSendReply(comment._id)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600"
                                   >
                                        <Send size={16} />
                                   </button>
                              </div>
                         </div>
                    )}

                    {/* Children comments */}
                    {(comment.replies && comment.replies.length > 0) && (
                         <div className="mt-2 w-full flex flex-col space-y-2">
                              {!showChildren ? (
                                   <button
                                        onClick={() => setShowChildren(true)}
                                        className="text-xs text-blue-500 font-medium ml-2 hover:underline flex items-center gap-1"
                                   >
                                        <span>View all {comment.replies.length} {comment.replies.length > 1 ? "replies" : "reply"}</span>
                                   </button>
                              ) : (
                                   <div className="space-y-2">
                                        {comment.replies.map((child) => (
                                             <div key={child._id} className="relative pl-4">
                                                  {/* Visual indicator cho comment con */}
                                                  <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col items-center">
                                                       <div className="w-0.5 h-full bg-gray-200"></div>
                                                       <div className="w-2 h-0.5 bg-gray-200 mt-2"></div>
                                                  </div>

                                                  <CommentItem
                                                       comment={child}
                                                       postData={postData}
                                                       userInfo={userInfo}
                                                       onReply={onReply}
                                                       onDelete={onDelete}
                                                  />
                                             </div>
                                        ))}
                                        <button
                                             onClick={() => setShowChildren(false)}
                                             className="text-xs text-gray-500 font-medium ml-6 hover:underline flex items-center gap-1"
                                        >
                                             <span>Hide replies</span>
                                        </button>
                                   </div>
                              )}
                         </div>
                    )}

               </div>
          </div>
     );
};

export default CommentItem;