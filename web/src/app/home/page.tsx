'use client';
import Home from '@/app/home/components/home/Home';
import RightSidebar from '@/app/home/components/rightsidebar/RightSidebar';
import Header from '@/app/components/header/Header';
import Sidebar from '@/app/components/sidebar/SideBar';
import React from 'react';
import TabBar from './components/home/TabBar';
import { useHomePage } from './hooks/useHomePage';
import UploadProgress from '../posts/components/UploadProgress';


const HomePage: React.FC = () => {
    const { actionSideBar, setActiveSideBar } = useHomePage();

    return (
        <div className="min-h-screen bg-gray-100 mt-2">
            <Header />

            <main className="flex ">
                {/* Sidebar trái */}
                <div className="hidden xl:block w-72 border-r border-gray-200 bg-white shadow-sm">
                    <Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />
                </div>

                {/* Nội dung chính */}
                <div className="flex-1 h-full overflow-y-auto px-2 md:px-4 scrollbar-hide">
                    <div className="max-w-2xl mx-auto  ">
                        <div className="mt-1">
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


                        </div>
                        <Home />
                    </div>
                </div>

                {/* RightSidebar phải */}
                <div className="hidden xl:flex xl:flex-col xl:w-[260px] xl:h-screen h-[calc(100vh-80px)] xl:overflow-y-auto border-l border-gray-200 shadow-md bg-white">
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250618/674d883a-df87-45f2-b6bf-0f4718cf894e--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                   </div>
                   <UploadProgress filename={''} progress={50}/>
            </main>
        </div>
    );
};

export default HomePage;
