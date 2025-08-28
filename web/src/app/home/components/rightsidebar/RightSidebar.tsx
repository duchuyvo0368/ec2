/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface RightSidebarProps {
    imageUrl: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ imageUrl }) => (
    <div className="sticky w-[260px] pt-1 bg-white overflow-y-auto scrollbar-hide ">
        <div className="h-[100px] overflow-hidden">
            <img
                src={imageUrl}
                alt="Sidebar content"
                className="w-full h-full object-cover"
            />
        </div>
    </div>
);

export default RightSidebar;
