import { useEffect, useRef, useState } from 'react';
import { FeelType } from '../type';

export function useFeelSync(postId: string, userId: string, initialFeel: FeelType) {
     const lastFeelRef = useRef<FeelType>(initialFeel);
     const [currentFeel, setCurrentFeel] = useState<FeelType>(initialFeel);

     useEffect(() => {
          const handleFeelUpdated = (e: CustomEvent) => {
               const { postId: pid, userId: uid, feel } = e.detail;
               if (pid === postId && uid === userId && feel !== lastFeelRef.current) {
                    lastFeelRef.current = feel;
                    setCurrentFeel(feel);
               }
          };

          window.addEventListener('feelUpdated', handleFeelUpdated as EventListener);

          return () => {
               window.removeEventListener('feelUpdated', handleFeelUpdated as EventListener);
          };
     }, [postId, userId]);

     const updateFeel = (newFeel: FeelType) => {
          if (newFeel !== lastFeelRef.current) {
               lastFeelRef.current = newFeel;
               setCurrentFeel(newFeel);

               // Thông báo cho các component khác
               window.dispatchEvent(new CustomEvent('feelUpdated', {
                    detail: { postId, userId, feel: newFeel }
               }));
          }
     };

     return { updateFeel, currentFeel };
}
