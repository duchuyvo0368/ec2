import React from 'react';
import FriendsGrid from './grid/FriendGrid';
import UserGrid from '../../user/components/grid/UserGrid';
import RequestSentGrid from './grid/RequestSentGrid';
import FriendsRequestGrid from './grid/FriendRequestGrid';

interface FriendGridProps {
  type: 'friends' | 'suggestions' | 'request' | 'following' | 'sent';
}

const FriendGrid: React.FC<FriendGridProps> = ({ type }) => {
  let content;

  switch (type) {
    case 'friends':
      content = <FriendsGrid />;
      break;
    case 'suggestions':
      content = <UserGrid />;
      break;
    case 'request':
      content =<FriendsRequestGrid/>
      break;
    
    case 'sent':
     content= <RequestSentGrid/>
      break;
    default:
      content = <FriendsGrid />;
  }

    return (
        <div className="w-full mt-1 ">{content}</div>
        
    );
};

export default FriendGrid;
