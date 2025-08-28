import { useEffect, useState } from 'react';

interface User {
     _id: string;
     name: string;
     avatar?: string;
     email?: string;
}

export const useLocalStorageUser = () => {
     const [user, setUser] = useState<User | null>(null);

     useEffect(() => {
          const loadUserFromStorage = () => {
               const userJson = localStorage.getItem("userInfo");
               if (userJson) {
                    setUser(JSON.parse(userJson));
               }
          };

          // Load user data initially
          loadUserFromStorage();

          // Listen for localStorage changes (from other tabs/windows)
          const handleStorageChange = (e: StorageEvent) => {
               if (e.key === "userInfo") {
                    if (e.newValue) {
                         setUser(JSON.parse(e.newValue));
                    } else {
                         setUser(null);
                    }
               }
          };

          // Listen for custom avatar update events
          const handleAvatarUpdate = (event: CustomEvent) => {
               const newAvatarUrl = event.detail;
               console.log('Avatar update event received:', newAvatarUrl);

               setUser((prev) => {
                    if (prev) {
                         const updatedUser = { ...prev, avatar: newAvatarUrl };
                         console.log('Updated user state:', updatedUser);
                         return updatedUser;
                    }
                    return null;
               });

               // Also update localStorage immediately
               const stored = localStorage.getItem("userInfo");
               if (stored) {
                    const parsed = JSON.parse(stored);
                    const updatedUserInfo = {
                         ...parsed,
                         avatar: newAvatarUrl
                    };
                    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
                    console.log('Updated localStorage in avatar event handler:', updatedUserInfo);
               }
          };

          // Listen for custom user info update events
          const handleUserInfoUpdate = (event: CustomEvent) => {
               const updatedUser = event.detail;
               setUser(updatedUser);

               // Update localStorage
               localStorage.setItem("userInfo", JSON.stringify(updatedUser));
          };

          window.addEventListener('storage', handleStorageChange);
          window.addEventListener('avatarUpdated', handleAvatarUpdate as EventListener);
          window.addEventListener('userInfoUpdated', handleUserInfoUpdate as EventListener);

          // Cleanup function
          return () => {
               window.removeEventListener('storage', handleStorageChange);
               window.removeEventListener('avatarUpdated', handleAvatarUpdate as EventListener);
               window.removeEventListener('userInfoUpdated', handleUserInfoUpdate as EventListener);
          };
     }, []);

     // Function to update user info
     const updateUserInfo = (updatedUser: User) => {
          setUser(updatedUser);
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
          window.dispatchEvent(new CustomEvent('userInfoUpdated', { detail: updatedUser }));
     };

     // Function to update avatar only
     const updateAvatar = (newAvatarUrl: string) => {
          if (user) {
               const updatedUser = { ...user, avatar: newAvatarUrl };
               setUser(updatedUser);
               localStorage.setItem("userInfo", JSON.stringify(updatedUser));
               window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: newAvatarUrl }));
               window.dispatchEvent(new CustomEvent('userInfoUpdated', { detail: updatedUser }));
               console.log('Avatar updated via updateAvatar function:', updatedUser);
          }
     };

     // Function to test avatar update (for debugging)
     const testAvatarUpdate = (testAvatarUrl: string) => {
          console.log('Testing avatar update with URL:', testAvatarUrl);
          updateAvatar(testAvatarUrl);
     };

     // Function to clear user data
     const clearUser = () => {
          setUser(null);
          localStorage.removeItem("userInfo");
     };

     return {
          user,
          updateUserInfo,
          updateAvatar,
          clearUser,
          testAvatarUpdate
     };
};
