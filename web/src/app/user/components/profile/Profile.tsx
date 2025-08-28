/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { JSX } from 'react';
import SkeletonProfile from '@/app/user/components/skeleton/SkeletonProfile';
import { useProfile } from '../../hooks/useProfile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PostCard from '../card/UserPostCard';

// --- Helper Components for Icons ---

const UserPlusIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
     >
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" />
     </svg>
);
const UserMinusIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
     >
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" />
     </svg>
);
const CheckIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
     >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
     </svg>
);
const MessageIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
     >
          <path
               fillRule="evenodd"
               d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
               clipRule="evenodd"
          />
     </svg>
);
const BriefcaseIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
     >
          <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
     </svg>
);
const AcademicCapIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
     >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
     </svg>
);
const HomeIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
     >
          <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
     </svg>
);
const EllipsisHorizontalIcon = ({ className = 'h-6 w-6' }) => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
     >
          <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M5 12h.01M12 12h.01M19 12h.01"
          />
     </svg>
);
const VideoCameraIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-500"
          viewBox="0 0 20 20"
          fill="currentColor"
     >
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" />
     </svg>
);
const PhotoIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-500"
          viewBox="0 0 20 20"
          fill="currentColor"
     >
          <path
               fillRule="evenodd"
               d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
               clipRule="evenodd"
          />
     </svg>
);
const FaceSmileIcon = () => (
     <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
     >
          <path
               fillRule="evenodd"
               d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a.75.75 0 00-1.06-1.06l-1.47 1.47-1.47-1.47a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l2.5-2.5z"
               clipRule="evenodd"
          />
     </svg>
);

const ProfilePage: React.FC = () => {
     type RelationType =
          | 'me'
          | 'accepted'
          | 'pending_sent'
          | 'pending_received'
          | 'following'
          | 'followed'
          | 'stranger';

     const {
          userId,
          user,
          loading,
          relation,
          friendCount,
          userInfo,
          isFollowing,
          followerCount,
          friendLoading,
          followLoading,
          posts,
          pageInfo,
          postLoading,
          handleAvatarChange,
          handleAddFriend,
          handleAcceptFriend,
          handleCancelRequest,
          handleUnfriend,
          handleFollow,
          handleUnfollow,
          handleGetPost,
     } = useProfile();

     const renderActionButtons = () => {
          const anyLoading = friendLoading || followLoading;
          const buttonBase =
               'flex items-center gap-1.5 px-3 h-8 rounded-md text-sm font-semibold transition disabled:opacity-50';

          if (relation === 'me') {
               return (
                   <div className="flex items-center gap-2">
                       <button className="flex items-center gap-1 bg-blue-500 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-600 transition h-9">
                           <span className="text-base">+</span> Add to Story
                       </button>
                       <button className="flex items-center gap-1 bg-gray-200 text-black text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-300 transition h-9">
                           ✏️ Edit Profile
                       </button>
                   </div>
               );
          }

          const buttonsMap: { [key in RelationType]?: JSX.Element } = {
               stranger: (
                    <button
                         onClick={handleAddFriend}
                         disabled={anyLoading}
                         className={`${buttonBase} bg-blue-500 text-white hover:bg-blue-600`}
                    >
                         <UserPlusIcon />
                         Add Friend
                    </button>
               ),
               pending_sent: (
                    <button
                         onClick={handleCancelRequest}
                         disabled={anyLoading}
                         className={`${buttonBase} bg-gray-300 hover:bg-gray-400`}
                    >
                         Cancel Request
                    </button>
               ),
               pending_received: (
                    <div className="flex gap-2">
                         <button
                              onClick={handleAcceptFriend}
                              disabled={anyLoading}
                              className={`${buttonBase} bg-blue-500 text-white hover:bg-blue-600`}
                         >
                              Accept
                         </button>
                         <button
                              onClick={handleCancelRequest}
                              disabled={anyLoading}
                              className={`${buttonBase} bg-red-500 text-white hover:bg-red-600`}
                         >
                              Reject
                         </button>
                    </div>
               ),
               accepted: (
                    <button
                         onClick={handleUnfriend}
                         disabled={anyLoading}
                         className={`${buttonBase} bg-gray-300 hover:bg-gray-400`}
                    >
                         Unfriend
                    </button>
               ),
          };

          return (
               <div className="flex items-center gap-2">
                    {relation && buttonsMap[relation]}
                    {/** Nút Follow / Unfollow */}
                    {isFollowing ? (
                         <button
                              onClick={handleUnfollow}
                              disabled={anyLoading}
                              className={`${buttonBase} bg-gray-200 hover:bg-gray-300`}
                         >
                              Unfollow
                         </button>
                    ) : (
                         <button
                              onClick={handleFollow}
                              disabled={anyLoading}
                              className={`${buttonBase} bg-gray-200 hover:bg-gray-300`}
                         >
                              Follow
                         </button>
                    )}
                    {/** Nút Message */}
               </div>
          );
     };

     if (loading || !user) {
          return (
               <div className="bg-gray-100 min-h-screen">
                    <div className="p-6">
                         {' '}
                         <SkeletonProfile />{' '}
                    </div>
               </div>
          );
     }

     return (
          <main className="w-full max-w-[1200px] mx-auto pt-2 items-left">
               <header className="bg-white rounded-lg shadow-sm">
                    <div className="relative">
                         <img
                              src="https://file.apetavers.com/api/files/admin/20241226/3d48b567-fd61-415d-a2bc-aa09966a05cd.png"
                              alt="Cover"
                              className="w-full h-20 md:h-50 object-cover rounded-t-lg"
                         />
                         <div className="absolute -bottom-8 left-7 top-38">
                              <div className="relative">
                                   <img
                                        src={user.avatar || 'default_avatar.png'}
                                        alt="Avatar"
                                        className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
                                   />
                                   {relation === 'me' && (
                                        <label className="absolute bottom-2 right-2.5 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-300 border-2 border-white">
                                             <input
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={handleAvatarChange}
                                             />
                                             <CameraAltIcon fontSize="small" />
                                        </label>
                                   )}
                              </div>
                         </div>
                    </div>

                    <div className="flex justify-between items-end px-8 pb-4 pt-2">
                         <div className="ml-[120px]">
                              <h1 className="text-3xl font-bold">{user.name}</h1>
                              <p className="text-gray-500 font-semibold mt-1">
                                   {friendCount} friends
                              </p>
                         </div>
                         {renderActionButtons()}
                    </div>
                    <div className="border-t border-gray-300 px-8">
                         <nav className="flex items-center">
                              <a
                                   href="#"
                                   className="py-4 px-4 text-sm font-semibold text-blue-600 border-b-2 border-blue-600"
                              >
                                   Posts
                              </a>
                              <a
                                   href="#"
                                   className="py-4 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                   About
                              </a>
                              <a
                                   href="#"
                                   className="py-4 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                   Friends
                              </a>
                         </nav>
                    </div>
               </header>

               <div className="grid grid-cols-12 gap-4 mt-4">
                    {/* Info */}
                    <div className="col-span-4">
                         <div className="bg-white pl-4 pr-4 pt-4 pb-4 rounded-lg shadow-sm">
                              <h2 className="text-xl font-bold mb-4">Intro</h2>
                              <ul className="space-y-2 text-sm">
                                   <li className="flex items-center gap-3">
                                        <BriefcaseIcon />
                                        <span>
                                             Works at <strong>Apetech</strong>
                                        </span>
                                   </li>
                                   <li className="flex items-center gap-3">
                                        <AcademicCapIcon />
                                        <span>
                                             Studied at <strong> Vietnam University</strong>
                                        </span>
                                   </li>
                                   <li className="flex items-center gap-3">
                                        <HomeIcon />
                                        <span>
                                             Lives in <strong>Da Nang</strong>
                                        </span>
                                   </li>
                              </ul>
                         </div>
                    </div>

                    {/* Posts */}
                    <div className="col-span-8">
                         <div className="bg-white p-4 rounded-lg shadow-sm">
                              {/* Create Post */}
                              <div className="flex items-center gap-3 pb-3 border-b border-gray-300">
                                   <img
                                        src={user?.avatar || 'default_avatar.png'}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full"
                                   />
                                   <div className="flex-1 text-left text-gray-500 bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200">
                                        What&apos;s on your mind, {user?.name.split(' ')[0]}?
                                   </div>
                              </div>
                              {/* Options */}
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                   <button className="flex items-center justify-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-100 transition">
                                        <VideoCameraIcon />
                                        <span className="font-medium text-xs text-gray-600">
                                             Live Video
                                        </span>
                                   </button>
                                   <button className="flex items-center justify-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-100 transition">
                                        <PhotoIcon />
                                        <span className="font-medium text-xs text-gray-600">
                                             Photo/Video
                                        </span>
                                   </button>
                                   <button className="flex items-center justify-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-100 transition">
                                        <FaceSmileIcon />
                                        <span className="font-medium text-xs text-gray-600">
                                             Feeling/Activity
                                        </span>
                                   </button>
                              </div>
                              {/* Post list */}
                              <div className="overflow-y-auto pb-10 h-full w-full scrollbar-hide">
                                   {posts.map((post, idx) => (
                                        <PostCard
                                             key={post._id || idx}
                                             postId={post._id}
                                             userName={user?.name}
                                             avatar={user?.avatar || 'default_avatar.png'}
                                             title={post.title}
                                             time={post.createdAt}
                                             content={post.content}
                                             privacy={post.privacy}
                                             relation={relation || ''}
                                             hashtags={post.hashtags || []}
                                             feels={post.feels || []}
                                             images={Array.isArray(post.images) ? post.images : []}
                                             videos={Array.isArray(post.videos) ? post.videos : []}
                                             views={post.views}
                                             feel_count={post.feel_count || {
                                                  like: 0,
                                                  haha: 0,
                                                  love: 0,
                                                  wow: 0,
                                                  sad: 0,
                                                  angry: 0,
                                             }}
                                             comments={post.comments}
                                             createdAt={post.createdAt}
                                             post_link_meta={post.post_link_meta}
                                             handleGetPost={handleGetPost}
                                             my_feel={post.my_feel}
                                        />
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>
          </main>
     );
};

export default ProfilePage;
