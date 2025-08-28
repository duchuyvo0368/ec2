/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { requestForToken, onMessageListener } from "@/utils/firebase";
import type { Notification as DropdownNotification } from "@/app/notification/Notification";
import { useLocalStorageUser } from "@/app/user/hooks/useLocalStorageUser";

// Using Notification shape from NotificationDropdown component
import {
     Settings as SettingsIcon,
     Link as LinkIcon,
     Person as PersonIcon,
     SwapHoriz as SwapHorizIcon,
     HelpOutline as HelpOutlineIcon,
     History as HistoryIcon,
     Logout as LogoutIcon,
} from "@mui/icons-material";
import { getAuthHeaders } from "@/utils/index"; // nếu bạn có
import NotificationDropdown from "@/app/notification/Notification";

interface User {
     _id: string;
     name: string;
     avatar?: string;
     email?: string;
}

const Header: React.FC = () => {
     const router = useRouter();
     const { user, clearUser } = useLocalStorageUser();
     const [notifications, setNotifications] = useState<DropdownNotification[]>(
          []
     );
     const [menuOpen, setMenuOpen] = useState(false);
     const menuRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
          // Request notification permission and get FCM token
          const initNotifications = async () => {
               try {
                    // Kiểm tra nếu trình duyệt hỗ trợ notification
                    if (!("Notification" in window)) {
                         console.warn("This browser does not support notifications");
                         return;
                    }

                    // Xin quyền notification nếu chưa được cấp
                    if (Notification.permission === "default") {
                         const result = await Notification.requestPermission();
                         if (result === "granted") {
                              console.log("Notification permission granted");
                              // Sau khi được cấp quyền, lấy FCM token
                              const token = await requestForToken();
                              if (token) {
                                   // Gửi token lên server để lưu
                                   try {
                                        await axios.post(
                                             "http://localhost:5000/v1/api/fcm/update-fcm",
                                             { fcmToken: token },
                                             { headers: getAuthHeaders() }
                                        );
                                        console.log("FCM token updated successfully");
                                   } catch (error) {
                                        console.error("Failed to update FCM token:", error);
                                   }
                              }
                         }
                    } else if (Notification.permission === "granted") {
                         const token = await requestForToken();
                         if (token) {
                              try {
                                   await axios.post(
                                        "http://localhost:5000/v1/api/fcm/update-fcm",
                                        { fcmToken: token },
                                        { headers: getAuthHeaders() }
                                   );
                                   console.log("FCM token updated successfully");
                              } catch (error) {
                                   console.error("Failed to update FCM token:", error);
                              }
                         }
                    }
               } catch (error) {
                    console.error("Error initializing notifications:", error);
               }
          };

          initNotifications();

          // Listen for foreground messages
          onMessageListener()
               .then((payload: any) => {
                    console.log("Received foreground message:", payload);
                    const { title, body } = payload.notification;

                    // Add new notification to state
                    setNotifications((prev) => [
                         {
                              id: Date.now().toString(),
                              name: title || "System",
                              text: body || "",
                              time: new Date().toLocaleTimeString(),
                              read: false,
                              type: (payload.data?.type as any) || "system",
                         },
                         ...prev,
                    ]);

                    // Show browser notification
                    if (Notification.permission === "granted") {
                         new Notification(title, {
                              body,
                              icon: "/icons/icon-192x192.png",
                         });
                    }
               })
               .catch((err) =>
                    console.log("Failed to receive foreground message:", err)
               );
     }, []);



     // Close avatar dropdown when clicking outside
     useEffect(() => {
          const handleClickOutside = (e: MouseEvent) => {
               if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                    setMenuOpen(false);
               }
          };
          document.addEventListener("mousedown", handleClickOutside);
          return () => document.removeEventListener("mousedown", handleClickOutside);
     }, []);

     const onLogout = async () => {
          try {
               await axios.post(
                    "http://localhost:5000/v1/api/auth/logout",
                    {},
                    { headers: getAuthHeaders() }
               );
               clearUser();
               localStorage.removeItem("accessToken");
               localStorage.removeItem("refreshToken");
               router.push("/login");
          } catch (err) {
               console.error("Logout failed:", err);
          }
     };

     return (
          <header className="bg-white shadow-md py-2 px-4 sticky top-0 z-50">
               <div className="flex justify-between items-center">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                         <button className="p-2" aria-label="Open menu">
                              {/* icon menu */}
                              <svg
                                   width="28"
                                   height="28"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="#333"
                                   strokeWidth="2.2"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                              >
                                   <line x1="4" y1="6" x2="20" y2="6" />
                                   <line x1="4" y1="12" x2="20" y2="12" />
                                   <line x1="4" y1="18" x2="20" y2="18" />
                              </svg>
                         </button>
                         {/* weather */}
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg
                                   width="28"
                                   height="28"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="#4fc3f7"
                                   strokeWidth="2"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                              >
                                   <circle cx="12" cy="12" r="5" fill="#b3e5fc" />
                                   <path d="M17 17.5a5 5 0 0 0-10 0" stroke="#90caf9" />
                              </svg>
                              <div>
                                   <span className="font-medium">
                                        Hanoi, <span className="text-[#4fc3f7]">19.03°C</span>
                                   </span>
                                   <div className="text-xs text-gray-400">mây cụm</div>
                              </div>
                         </div>
                    </div>
                    {/* Icons bar (trước avatar) */}

                    {/* Right */}
                    <div className="flex items-center gap-1">
                         <div className="flex items-center gap-3 mr-4">
                              <button className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                                   <svg
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        className="text-gray-700"
                                        viewBox="0 0 20 20"
                                   >
                                        <path d="M10 15.27l5.18 3.05-1.64-5.81L18 8.63l-5.91-.51L10 3 7.91 8.12 2 8.63l4.46 3.88L4.82 17z" />
                                   </svg>
                              </button>

                              <button className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                                   <svg
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        className="text-gray-700"
                                        viewBox="0 0 24 24"
                                   >
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                                   </svg>
                                   <span className="absolute text-[10px] font-semibold text-blue-500 top-[23px] left-[8px]"></span>
                              </button>

                              {/* Notifications */}
                              <NotificationDropdown
                                   notifications={notifications}
                                   onMarkRead={(id) =>
                                        setNotifications((prev) =>
                                             prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                                        )
                                   }
                              />
                         </div>
                         {user ? (
                              <div className="relative" ref={menuRef}>
                                   {/* Trigger: Avatar và tên (click to toggle) */}
                                   <button
                                        type="button"
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => setMenuOpen((o) => !o)}
                                   >
                                        {user.avatar && (
                                             <img
                                                  src={user.avatar}
                                                  alt="avatar"
                                                  className="w-8 h-8 rounded-full object-cover shadow-sm hover:ring-2 hover:ring-blue-300 transition"
                                             />
                                        )}
                                        <span className="font-medium text-gray-800 hover:text-blue-600 transition">
                                             {user.name}
                                        </span>
                                   </button>

                                   {/* Dropdown (controlled by click) */}
                                   {menuOpen && (
                                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl z-50 transition-all duration-200 ease-in-out">
                                             <div className="flex items-center gap-3 px-4 py-3 border-b">
                                                  <img
                                                       src={user.avatar}
                                                       alt="avatar"
                                                       className="w-10 h-10 rounded-full object-cover shadow"
                                                  />
                                                  <div>
                                                       <Link href={`/profile/${user._id}`}>
                                                            <span className="font-medium text-sm text-gray-800 flex items-center gap-1">
                                                                 {user.name}
                                                                 <svg
                                                                      className="w-3.5 h-3.5"
                                                                      viewBox="0 0 24 24"
                                                                      fill="none"
                                                                 >
                                                                      <circle cx="12" cy="12" r="10" fill="#2196f3" />
                                                                      <path
                                                                           d="M8 12.5l2.5 2.5 5-5"
                                                                           stroke="#fff"
                                                                           strokeWidth="2"
                                                                           strokeLinecap="round"
                                                                           strokeLinejoin="round"
                                                                      />
                                                                 </svg>
                                                            </span>
                                                       </Link>
                                                  </div>
                                             </div>

                                             <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                                                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
                                                       <SettingsIcon
                                                            fontSize="small"
                                                            className="text-blue-500"
                                                       />
                                                       Account settings
                                                  </li>
                                                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
                                                       <LinkIcon fontSize="small" className="text-blue-500" />
                                                       Referral link
                                                  </li>
                                                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
                                                       <PersonIcon fontSize="small" className="text-blue-500" />
                                                       Profile settings
                                                  </li>
                                                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
                                                       <SwapHorizIcon
                                                            fontSize="small"
                                                            className="text-blue-500"
                                                       />
                                                       Switch account
                                                  </li>
                                                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
                                                       <HelpOutlineIcon
                                                            fontSize="small"
                                                            className="text-blue-500"
                                                       />
                                                       Help center
                                                  </li>
                                                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
                                                       <HistoryIcon fontSize="small" className="text-blue-500" />
                                                       Activity
                                                  </li>
                                             </ul>

                                             <div
                                                  onClick={() => {
                                                       onLogout();
                                                       setMenuOpen(false);
                                                  }}
                                                  className="px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer text-sm transition"
                                             >
                                                  <LogoutIcon fontSize="small" className="text-red-500" />
                                                  <span>Logout</span>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         ) : (
                              <Link href="/login">
                                   <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Login
                                   </button>
                              </Link>
                         )}
                    </div>
               </div>
          </header>
     );
};

export default Header;
