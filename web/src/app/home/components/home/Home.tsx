/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import PostCard from '../../../posts/components/PostCard';
import { UserInfo } from '../../type';
import CreatePostModal from '@/app/posts/components/CreatePostModal';
import { PostFromServer } from '@/app/posts/type';
import InfiniteScroll from '@/app/components/infinitescroll/IfiniteScroll';
import StoryBar from '../story/StoryBar';
import { useHomeFeed } from '../../hooks/useHomeFeed';
import TabBar from './TabBar';

const Home: React.FC = () => {
     const {
          userInfo,
          showModal,
          setShowModal,
          posts,
          loading,
          error,
          page,
          totalPages,
          loadMoreData,
          hasMoreData,
          handlePostCreated,
     } = useHomeFeed();

     const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
     const lastScrollTopRef = React.useRef(0);
     const [tabBarAtTop, setTabBarAtTop] = React.useState(false);

     React.useEffect(() => {
          const el = scrollContainerRef.current;
          if (!el) return;
          const onScroll = () => {
               const current = el.scrollTop;
               const goingUp = current < lastScrollTopRef.current;
               const nearTop = current < 4;
               setTabBarAtTop(nearTop || goingUp);
               lastScrollTopRef.current = current;
          };
          el.addEventListener('scroll', onScroll, { passive: true });
          return () => el.removeEventListener('scroll', onScroll);
     }, []);

     if (!userInfo) {
          return (
               <div className="flex justify-center items-center h-screen">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
               </div>
          );
     }

     return (
          <div className="flex gap-1 mt-1 h-[calc(100vh-80px)]">




               {/* <div className={`sticky ${tabBarAtTop ? 'top-0' : 'top-4'} z-20 bg-white transition-all duration-200`}>
                         <TabBar
                              tabs={[
                                   "Posts",
                                   "Design",
                                   "Funny",
                                   "Sports",
                                   "Video",
                                   "VR360",
                                   "Tools"
                              ]}
                              onSelect={(idx) => console.log("Tab:", idx)}
                         />
                    </div> */}


               <div ref={scrollContainerRef} className="mt-1 space-y-4 items-center justify-center overflow-y-auto pb-5 h-full scrollbar-hide">
                    {error ? (
                         <div className="bg-white p-1 rounded-lg shadow text-red-500 text-center">{error}</div>
                    ) : posts.length === 0 && !loading ? (
                         <div className="flex items-center justify-center min-h-screen">
                              <span></span>  
                         </div>



                    ) : (
                         <InfiniteScroll
                              fetchMore={loadMoreData}
                              hasMore={hasMoreData}
                              loading={loading}
                              loader={<div className="text-center">Loading posts...</div>}
                              skeleton={
                                   <div className="space-y-4">
                                        {[1, 2, 3].map((_, idx) => (
                                             <div key={idx} className="bg-white rounded-md p-4 shadow animate-pulse">
                                                  <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                                                       <div className="w-10 h-10 rounded-full bg-gray-200" />
                                                       <div className="flex-1 space-y-2 py-1">
                                                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                                                            <div className="h-2 bg-gray-200 rounded w-1/4" />
                                                       </div>
                                                  </div>
                                                  <div className="h-3 bg-gray-200 rounded mt-2 w-full" />
                                                  <div className="h-3 bg-gray-200 rounded mt-1 w-5/6" />
                                                  <div className="h-3 bg-gray-200 rounded mt-1 w-2/3" />
                                                  <div className="mt-3 w-full h-64 bg-gray-200 rounded" />
                                                  <div className="mt-2 flex justify-between items-center">
                                                       <div className="h-3 bg-gray-200 rounded w-20" />
                                                       <div className="h-3 bg-gray-200 rounded w-16" />
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              }
                              endMessage={<div className="text-center text-gray-500">No more posts</div>}
                              className="space-y-1"
                              root={scrollContainerRef.current}
                              rootMargin={'100px'}
                              threshold={0.2}
                         >
                              <div className="bg-white rounded-lg p-2 flex items-center gap-3 shadow h-full">
                                   <img
                                        src={userInfo.avatar || 'https://hoseiki.vn/wp-content/uploads/2025/03/avatar-mac-dinh-3.jpg'}
                                        alt="User avatar"
                                        className="w-9 h-9 rounded-full object-cover"
                                   />
                                   <div
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full px-3 py-1.5 text-gray-600 text-sm"
                                        onClick={() => setShowModal(true)}
                                   >
                                        Share your moments and memories!
                                   </div>
                              </div>

                              {showModal && (
                                   <div className="fixed inset-0 z-[9999] pointer-events-auto">
                                        <CreatePostModal
                                             open={showModal}
                                             userInfo={userInfo}
                                             onClose={() => setShowModal(false)}
                                             onPostCreated={handlePostCreated}
                                        />
                                   </div>
                              )}

                              <StoryBar
                                   stories={[
                                        {
                                             id: "create",
                                             name: "Tạo tin",
                                             avatar: "",
                                             image: (userInfo.avatar?.trim() || "https://randomuser.me/api/portraits/men/32.jpg"),
                                             isCreate: true,
                                        },
                                        {
                                             id: "1",
                                             name: "Thúy Huyền",
                                             avatar: "https://randomuser.me/api/portraits/women/45.jpg",
                                             image: "https://images.unsplash.com/photo-1593642532400-2682810df593?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
                                        },
                                        {
                                             id: "2",
                                             name: "Hue Tran",
                                             avatar: "https://randomuser.me/api/portraits/men/48.jpg",
                                             image: "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D",
                                        },
                                        {
                                             id: "3",
                                             name: "Phuong Nghi",
                                             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                                             image: "https://miro.medium.com/v2/0*-1vyXx-q9rdHkfPe.jpeg",
                                        },
                                        {
                                             id: "4",
                                             name: "Phuong Nghi",
                                             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                                             image: "https://preview.redd.it/some-of-my-favourite-bird-images-from-the-last-12-months-v0-xeq2o4k737se1.jpg?width=640&crop=smart&auto=webp&s=20e34f50040ae8a8520d257ec8116d64f095fc02",
                                        },
                                        {
                                             id: "5",
                                             name: "Phuong Nghi",
                                             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                                             image: "https://images.unsplash.com/photo-1593642532400-2682810df593?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
                                        },
                                   ]}
                                   onCreate={() => console.log("Tạo tin mới")}
                              />

                              {posts.map((post) => (
                                   <PostCard
                                        key={post._id}
                                        userName={post.userId.name || userInfo.name}
                                        postId={post._id}
                                        userId={post.userId._id}
                                        avatar={post.userId.avatar || userInfo.avatar}
                                        title={post.title || 'No title'}
                                        content={post.content || ''}
                                        hashtags={post.hashtags ?? []}
                                        images={Array.isArray(post.images) ? post.images : []}
                                        videos={Array.isArray(post.videos) ? post.videos : []}
                                        createdAt={post.createdAt}
                                        feels={post.feels || []}
                                        privacy={post.privacy}
                                        my_feel={post.my_feel}
                                        feelCount={post.feel_count as any}
                                        comments={post.comments || 0}
                                        views={post.views}
                                        post_link_meta={post.post_link_meta}
                                   />
                              ))}

                              {loading && posts.length > 0 && (
                                   <div className="space-y-4">
                                        {[1, 2].map((_, idx) => (
                                             <div key={`loading-skel-${idx}`} className="bg-white rounded-md p-4 shadow animate-pulse">
                                                  <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                                                       <div className="w-10 h-10 rounded-full bg-gray-200" />
                                                       <div className="flex-1 space-y-2 py-1">
                                                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                                                            <div className="h-2 bg-gray-200 rounded w-1/4" />
                                                       </div>
                                                  </div>
                                                  <div className="h-3 bg-gray-200 rounded mt-2 w-full" />
                                                  <div className="h-3 bg-gray-200 rounded mt-1 w-5/6" />
                                                  <div className="h-3 bg-gray-200 rounded mt-1 w-2/3" />
                                                  <div className="mt-3 w-full h-64 bg-gray-200 rounded" />
                                                  <div className="mt-2 flex justify-between items-center">
                                                       <div className="h-3 bg-gray-200 rounded w-20" />
                                                       <div className="h-3 bg-gray-200 rounded w-16" />
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </InfiniteScroll>

                    )}
                    {loading && posts.length === 0 && (
                         <div className="flex justify-center w-full">
                              <div className="w-full max-w-2xl space-y-4">
                                   {[1, 2, 3].map((_, idx) => (
                                        <div key={idx} className="bg-white rounded-md p-4 shadow animate-pulse">
                                             {/* Header skeleton */}
                                             <div className="flex items-start gap-3 pb-3 border-gray-200">
                                                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                                                  <div className="flex-1 space-y-2 py-1">
                                                       <div className="h-3 bg-gray-200 rounded w-1/3" />
                                                       <div className="h-2 bg-gray-200 rounded w-1/4" />
                                                  </div>
                                             </div>
                                             {/* Content skeleton */}
                                             <div className="h-3 bg-gray-200 rounded mt-2 w-full" />
                                             <div className="h-3 bg-gray-200 rounded mt-1 w-5/6" />
                                             <div className="h-3 bg-gray-200 rounded mt-1 w-2/3" />
                                             {/* Media skeleton */}
                                             <div className="mt-3 w-full h-64 bg-gray-200 rounded" />
                                             {/* Footer skeleton */}
                                             <div className="mt-2 flex justify-between items-center">
                                                  <div className="h-3 bg-gray-200 rounded w-20" />
                                                  <div className="h-3 bg-gray-200 rounded w-16" />
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    )}
               </div>

          </div>
     );
};

export default Home;
