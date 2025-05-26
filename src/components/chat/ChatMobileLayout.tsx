
import React from 'react';
import ChatUsersList from './ChatUsersList';
import ChatWindow from './ChatWindow';

interface ChatUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  has_unread_messages?: boolean;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface ChatMobileLayoutProps {
  showUsersList: boolean;
  users: ChatUser[];
  filteredUsers: ChatUser[];
  selectedUser: ChatUser | null;
  messages: ChatMessage[];
  newMessage: string;
  searchTerm: string;
  currentUserId: string | undefined;
  isAdmin: boolean;
  onSearchChange: (value: string) => void;
  onUserSelect: (user: ChatUser) => void;
  onBackToUsers: () => void;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatMobileLayout: React.FC<ChatMobileLayoutProps> = ({
  showUsersList,
  users,
  filteredUsers,
  selectedUser,
  messages,
  newMessage,
  searchTerm,
  currentUserId,
  isAdmin,
  onSearchChange,
  onUserSelect,
  onBackToUsers,
  onMessageChange,
  onSendMessage,
}) => {
  return (
    <div className="block lg:hidden">
      {showUsersList ? (
        <ChatUsersList
          users={users}
          filteredUsers={filteredUsers}
          selectedUser={selectedUser}
          searchTerm={searchTerm}
          isAdmin={isAdmin}
          onSearchChange={onSearchChange}
          onUserSelect={onUserSelect}
        />
      ) : (
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          newMessage={newMessage}
          currentUserId={currentUserId}
          isMobile={true}
          onBackToUsers={onBackToUsers}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
        />
      )}
    </div>
  );
};

export default ChatMobileLayout;
