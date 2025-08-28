'use client';

import React from 'react';
import { useLocalStorageUser } from '@/app/user/hooks/useLocalStorageUser';

const AvatarTest: React.FC = () => {
     const { user, updateAvatar, testAvatarUpdate } = useLocalStorageUser();

     const handleTestAvatar = () => {
          const testUrl = 'https://example.com/test-avatar.jpg';
          testAvatarUpdate(testUrl);
     };

     const handleUpdateAvatar = () => {
          const newUrl = 'https://example.com/new-avatar.jpg';
          updateAvatar(newUrl);
     };

     return (
          <div className="p-4 border rounded-lg bg-gray-50">
               <h3 className="text-lg font-semibold mb-4">Avatar Test Component</h3>

               <div className="mb-4">
                    <h4 className="font-medium mb-2">Current User Info:</h4>
                    <pre className="bg-white p-2 rounded text-sm overflow-auto">
                         {JSON.stringify(user, null, 2)}
                    </pre>
               </div>

               <div className="mb-4">
                    <h4 className="font-medium mb-2">Current Avatar:</h4>
                    {user?.avatar ? (
                         <img
                              src={user.avatar}
                              alt="Avatar"
                              className="w-16 h-16 rounded-full object-cover border"
                         />
                    ) : (
                         <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                              No Avatar
                         </div>
                    )}
               </div>

               <div className="space-y-2">
                    <button
                         onClick={handleTestAvatar}
                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    >
                         Test Avatar Update
                    </button>

                    <button
                         onClick={handleUpdateAvatar}
                         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                         Update Avatar
                    </button>
               </div>

               <div className="mt-4 text-sm text-gray-600">
                    <p>Check browser console for detailed logs</p>
                    <p>Check localStorage for userInfo updates</p>
               </div>
          </div>
     );
};

export default AvatarTest;
