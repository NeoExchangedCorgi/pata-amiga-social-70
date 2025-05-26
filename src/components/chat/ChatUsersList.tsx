
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle } from 'lucide-react';

interface ChatUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  has_unread_messages?: boolean;
}

interface ChatUsersListProps {
  users: ChatUser[];
  filteredUsers: ChatUser[];
  selectedUser: ChatUser | null;
  searchTerm: string;
  isAdmin: boolean;
  onSearchChange: (value: string) => void;
  onUserSelect: (user: ChatUser) => void;
}

const ChatUsersList: React.FC<ChatUsersListProps> = ({
  users,
  filteredUsers,
  selectedUser,
  searchTerm,
  isAdmin,
  onSearchChange,
  onUserSelect,
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          <span>{isAdmin ? 'Usuários' : 'Admin'}</span>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 lg:max-h-[60vh] overflow-y-auto">
          {filteredUsers.map((chatUser) => (
            <div
              key={chatUser.id}
              onClick={() => onUserSelect(chatUser)}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedUser?.id === chatUser.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium text-lg">
                    {chatUser.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{chatUser.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">@{chatUser.username}</p>
                </div>
                {chatUser.has_unread_messages && (
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatUsersList;
