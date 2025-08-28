'use client';
import Banner from '@/app/components/banner/Banner';
import Container from '@/app/components/container/Container';
import FriendGrid from '@/app/friends/components/Friend';
import Header from '@/app/components/header/Header';
import Sidebar from '@/app/components/sidebar/SideBar';
import TabBar from '@/app/components/tabbar/TabBar';
import React, { useState } from 'react';
import RightSidebar from '@/app/home/components/rightsidebar/RightSidebar';
import ProfilePage from '@/app/user/components/profile/Profile';
export default function Profile() {
     const [actionSideBar, setActiveSideBar] = useState(0);
     return (
          <div style={{ overflowX: 'hidden' }}>
               <Header />
               <main>
                    <div className="flex gap-2 ">
                         <div className="hidden xl:block w-72 border-r border-gray-200 bg-white shadow-sm">
                              <Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />
                         </div>
                         {/* Bên trái là profile */}
                         <div className="flex-1 w-[1200px] overflow-y-auto max-h-screen scrollbar-hide">
                              <ProfilePage />
                         </div>

                         {/* Bên phải là RightSidebar */}
                         <div className="hidden xl:flex xl:flex-col xl:w-[260px] xl:h-screen h-[calc(100vh-80px)] xl:overflow-y-auto border-l border-gray-200 shadow-md bg-white">
                              <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                              <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250618/674d883a-df87-45f2-b6bf-0f4718cf894e--1920.webp" />
                              <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp" />
                              <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                              <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                              <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                         </div>
                    </div>
               </main>
          </div>
     );
}
