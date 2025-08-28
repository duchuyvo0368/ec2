/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/NotificationDropdown.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { onMessageListener, requestForToken } from '@/utils/firebase';

export interface Notification {
  id: string;
  avatar?: string;
  name?: string;
  text: string;
  time: string;
  type?: 'friend_request' | 'system' | 'community';
  read?: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onMarkRead }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'community' | 'unread' | 'system'>('all');
  const [incomingNotification, setIncomingNotification] = useState<Notification | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const initFCM = async () => {
      const token = await requestForToken();
      console.log('FCM Token:', token);

      onMessageListener()
        .then((payload: any) => {
          console.log('Foreground message:', payload);
          setIncomingNotification({
            id: Date.now().toString(),
            name: payload.notification?.title || 'System',
            text: payload.notification?.body || '',
            time: new Date().toLocaleTimeString(),
            type: payload.data?.type || 'system',
            read: false,
          });
        })
        .catch((err) => console.log('FCM listener failed:', err));
    };

    initFCM();
  }, []);

  const allNotifications = incomingNotification ? [incomingNotification, ...notifications] : notifications;

  const filteredNotifications = allNotifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'community') return n.type === 'community';
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'system') return n.type === 'system';
    return true;
  });

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    if (onMarkRead) onMarkRead(id);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Button */}
      <button
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center relative"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg width="20" height="20" fill="currentColor" className="text-gray-700" viewBox="0 0 24 24">
          <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6v-5a6 6 0 0 0-5-5.91V4a1 1 0 1 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 p-2 border-b border-gray-200">
            {[
              { label: 'All', key: 'all' },
              { label: 'Community', key: 'community' },
              { label: 'Unread', key: 'unread' },
              { label: 'System', key: 'system' },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto max-h-90 scrollbar-thin">
            {filteredNotifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Không có thông báo</p>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`flex items-start gap-2 px-3 py-2 mt-1 cursor-pointer transition-all duration-150 ${
                    !n.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                  } rounded-lg`}
                >
                  {n.avatar ? (
                    <img src={n.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">
                      {n.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{n.name || 'System'}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{n.text}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
