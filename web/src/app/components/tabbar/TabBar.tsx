import React from 'react';
import { Users, Search } from 'lucide-react';

const tabList = [
     { label: 'All', badge: 5 },
     { label: 'Suggestions' },
     { label: 'Friend Requests', badge: 48 },
     { label: 'Request Sent' },
];

interface TabBarProps {
     activeTab: number | null;
     onSelect: ((idx: number) => void) | null;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelect }) => {
     return (
          <div className="w-full bg-white">
               {/* Title */}
               <div className="flex items-center gap-2 mb-1 px-2 pt-2">
                    <Users className="w-5 h-5 text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-800">Friends</h2>
               </div>

               {/* Tabs */}
               {/* Tabs */}
               <div className="flex w-full bg-white rounded-lg shadow-sm overflow-hidden">
                    {tabList.map((tab, idx) => (
                         <div
                              key={tab.label}
                              onClick={() => onSelect && onSelect(idx)}
                              className={`relative flex-1 text-center cursor-pointer py-1.5 px-3 text-sm font-medium transition-all duration-200${activeTab === idx
                                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500 font-semibold'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}rounded-t-lg`}
                         >
                              <span>{tab.label}</span>

                              {tab.badge !== undefined && tab.badge > 0 && (
                                   <span className="absolute top-1 right-2 flex items-center justify-center min-w-[14px] h-[14px] px-1 text-[8px] font-bold text-white bg-red-500 rounded-full shadow-sm">
                                        {tab.badge}
                                   </span>
                              )}
                         </div>
                    ))}
               </div>



               {/* Search Bar */}
               <div className="pt-2 pb-2 w-full">
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                              <Search className="w-4 h-4 text-gray-400" />
                         </div>
                         <input
                              type="text"
                              placeholder="Search friends, groups, pages, VDB ID..."
                              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                         />
                    </div>
               </div>
          </div>
     );
};

export default TabBar;
