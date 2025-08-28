import { useEffect } from 'react';

export const useAvatarUpdate = (setUserInfo: (userInfo: any) => void) => {
     useEffect(() => {
          const handleAvatarUpdate = (event: CustomEvent) => {
               const newAvatarUrl = event.detail;
               setUserInfo((prev: any) => prev ? { ...prev, avatar: newAvatarUrl } : null);
          };

          window.addEventListener('avatarUpdated', handleAvatarUpdate as EventListener);

          return () => {
               window.removeEventListener('avatarUpdated', handleAvatarUpdate as EventListener);
          };
     }, [setUserInfo]);
};
