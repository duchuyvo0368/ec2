/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Banner from '@/app/components/banner/Banner';
import Container from '@/app/components/container/Container';
import FriendGrid from '@/app/friends/components/Friend';
import Header from '@/app/components/header/Header';
import Sidebar from '@/app/components/sidebar/SideBar';
import TabBar from '@/app/components/tabbar/TabBar';
import React, { useState } from 'react';
import RightSidebar from '../home/components/rightsidebar/RightSidebar';

const tabTypeMap = ['friends', 'suggestions', 'request', 'sent'];

const FriendsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [actionSideBar, setActiveSideBar] = useState(0);
    return (
        <div className="overflow-x-hidden min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main content */}
            <div className="flex flex-1">
                {/* Left Sidebar */}
                <aside className="hidden xl:flex xl:flex-col w-[260px] border-r border-gray-200 shadow-md">
                    <Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />
                </aside>

                {/* Main area */}
                <main className="flex-1 p-2">
                    <TabBar activeTab={activeTab} onSelect={setActiveTab} />
                    <FriendGrid type={tabTypeMap[activeTab] as any} />
                </main>

                {/* Right Sidebar */}
                <aside className="hidden xl:flex xl:flex-col w-[260px] h-screen border-l border-gray-200 shadow-md bg-white overflow-y-auto">
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                    <div className="hidden xl:flex xl:flex-col xl:w-[260px] xl:h-screen h-[calc(100vh-80px)] xl:overflow-y-auto border-l border-gray-200 shadow-md bg-white">
                        <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                        <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250618/674d883a-df87-45f2-b6bf-0f4718cf894e--1920.webp" />
                        <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp" />
                        <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                        <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                        <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                    </div>
                </aside>

            </div>
        </div>

    );
};

export default FriendsPage;
