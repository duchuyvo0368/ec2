import React from 'react';

interface TypingIndicatorProps {
     users: string[];
     isVisible: boolean;
     currentUserName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users, isVisible, currentUserName }) => {
     const otherUsers = users.filter(user => user !== currentUserName);

     if (!isVisible || otherUsers.length === 0) {
          return <div className="h-8" />; // giữ chỗ chiều cao
     }

     return (
          <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg h-8">
               <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full " style={{ animationDelay: '0s' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full " style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full " style={{ animationDelay: '0.4s' }} />
               </div>

               <span>
                    {otherUsers.length === 1
                         ? `${otherUsers[0]} is typing...`
                         : `${otherUsers.slice(0, 2).join(', ')}${otherUsers.length > 2 ? ` and ${otherUsers.length - 2} others` : ''} are typing...`}
               </span>
          </div>
     );
};

export default TypingIndicator;
