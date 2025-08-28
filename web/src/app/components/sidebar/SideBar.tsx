'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import BrushIcon from '@mui/icons-material/Brush';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LayersIcon from '@mui/icons-material/Layers';
import DescriptionIcon from '@mui/icons-material/Description';
import { usePathname } from 'next/navigation';



const menuItems = [
  { label: 'Home', icon: <HomeIcon fontSize="small" style={{ color: '#00bfff' }} />, path: '/' },
  { label: 'Friend', icon: <DesignServicesIcon fontSize="small" style={{ color: '#3f51b5' }} />, path: '/friends' },
  { label: 'My Store', icon: <StoreMallDirectoryIcon fontSize="small" style={{ color: '#2196f3' }} /> },
  { label: 'Community', icon: <Diversity3Icon fontSize="small" style={{ color: '#1976d2' }} /> },
  { label: 'Digital Yearbook Exhibition', icon: <BrushIcon fontSize="small" style={{ color: '#795548' }} /> },
  { label: 'Profile', icon: <PersonIcon fontSize="small" style={{ color: '#e53935' }} /> },
  { label: 'Connections', icon: <PeopleAltIcon fontSize="small" style={{ color: '#00bcd4' }} /> },
  { label: 'Features', icon: <SettingsIcon fontSize="small" style={{ color: '#4caf50' }} /> },
  { label: 'Old Memories', icon: <HistoryEduIcon fontSize="small" style={{ color: '#f44336' }} /> },
  { label: 'Feeling & Moments', icon: <EmojiEmotionsIcon fontSize="small" style={{ color: '#2196f3' }} /> },
  { label: 'Coming soon', icon: <NewReleasesIcon fontSize="small" style={{ color: '#00e676' }} /> },
  { label: 'Life Utilities', icon: <AppsRoundedIcon fontSize="small" style={{ color: '#00bcd4' }} /> },
  { label: 'Brain Funny', icon: <PsychologyIcon fontSize="small" style={{ color: '#e91e63' }} /> },
  { label: 'Channel', icon: <LiveTvIcon fontSize="small" style={{ color: '#2196f3' }} /> },
  { label: 'Others', icon: <LayersIcon fontSize="small" style={{ color: '#ff9800' }} /> },
  { label: 'Event Report May 2024', icon: <DescriptionIcon fontSize="small" style={{ color: '#ffc107' }} /> },
];


const Sidebar: React.FC<{activeTab: number, onSelect: React.Dispatch<React.SetStateAction<number>>}> = ({activeTab, onSelect}) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (index: number) => {
        const item = menuItems[index];
        if (item.path) {
            router.push(item.path);
        }
    };

    return (
        <nav className="w-full p-4 bg-white shadow-md h-full overflow-y-auto scrollbar-hide">
            <ul className="space-y-1">
                {menuItems.map((item, index) => {
                    const isActive = item.path && pathname === item.path;
                    return (
                        <li
                            key={index}
                            onClick={() => handleClick(index)}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer 
                ${isActive ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                        >
                            <span className="w-5">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};


export default Sidebar;
