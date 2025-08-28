import { useState } from "react";

interface TabBarProps {
    tabs: string[];
    onSelect?: (index: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, onSelect }) => {
    const [active, setActive] = useState(0);

    const handleClick = (index: number) => {
        setActive(index);
        if (onSelect) onSelect(index);
    };

    return (
        <div className="flex w-full border-b border-gray-200 bg-white shadow-sm rounded-md overflow-hidden">
            {tabs.map((tab, idx) => (
                <div
                    key={idx}
                    onClick={() => handleClick(idx)}
                    className={`
            relative flex-1 text-center cursor-pointer py-2.5 px-3
            text-sm tracking-wide transition-colors duration-300
            ${active === idx
                            ? "font-medium text-gray-800 border-b border-blue-500"
                            : "font-normal text-gray-600 hover:text-blue-500"}
          `}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
};

export default TabBar;
