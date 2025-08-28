/* eslint-disable @next/next/no-img-element */
import React from "react";

interface Story {
    id: string;
    name: string;
    avatar: string;
    image: string;
    isCreate?: boolean;
}

interface StoryBarProps {
    stories: Story[];
    onCreate?: () => void;
}

const StoryBar: React.FC<StoryBarProps> = ({ stories, onCreate }) => {
    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            {stories.map((story) => (
                <div
                    key={story.id}
                    className="w-28 h-44 flex-shrink-0 rounded-md overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md transition"
                    onClick={() => story.isCreate && onCreate && onCreate()}
                >
                    <img
                        src={story.image}
                        alt={story.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay mờ cho chữ */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">{story.name}</p>
                    </div>

                    {/* Avatar */}
                    {!story.isCreate && (
                        <img
                            src={story.avatar}
                            alt={`${story.name} avatar`}
                            className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
                        />
                    )}

                    {/* Nút Tạo tin */}
                    {story.isCreate && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-2xl font-bold mb-2">
                                +
                            </div>
                            <p className="text-sm font-medium text-gray-700">Create Story</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StoryBar;
