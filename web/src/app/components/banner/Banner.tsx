import React from 'react';
import Image from 'next/image';
import RightSidebar from '@/app/home/components/rightsidebar/RightSidebar';

const Banner: React.FC = () => {
    return (
        <div className="flex">
            {/* Phần bên trái: nội dung chính */}
            <div className="flex-1 ">
                {/* Banner thu gọn chiều rộng */}
                <div className="w-full justify-center items-center shadow-md mb-2 overflow-hidden rounded-lg">
                    <Image
                        src="/slider.png"
                        alt="Banner"
                        width={1200}
                        height={300}
                        className="w-full h-24 object-cover"
                        priority
                    />
                </div>

                {/* Nội dung khác */}
            </div>


        </div>

    );
};

export default Banner;
