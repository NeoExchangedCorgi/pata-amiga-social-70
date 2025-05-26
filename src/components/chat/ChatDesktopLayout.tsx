
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

interface ChatDesktopLayoutProps {
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
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatDesktopLayout: React.FC<ChatDesktopLayoutProps> = ({
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
  onMessageChange,
  onSendMessage,
}) => {
  return (
    <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-[600px]">
      <ChatUsersList
        users={users}
        filteredUsers={filteredUsers}
        selectedUser={selectedUser}
        searchTerm={searchTerm}
        isAdmin={isAdmin}
        onSearchChange={onSearchChange}
        onUserSelect={onUserSelect}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        newMessage={newMessage}
        currentUserId={currentUserId}
        isMobile={false}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default ChatDesktopLayout;
