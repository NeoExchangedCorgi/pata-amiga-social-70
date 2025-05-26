
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';

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

interface ChatWindowProps {
  selectedUser: ChatUser | null;
  messages: ChatMessage[];
  newMessage: string;
  currentUserId: string | undefined;
  isMobile?: boolean;
  onBackToUsers?: () => void;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  newMessage,
  currentUserId,
  isMobile = false,
  onBackToUsers,
  onMessageChange,
  onSendMessage,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  if (!selectedUser) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="flex items-center justify-center h-96 lg:h-[60vh]">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Selecione um usuário para começar a conversar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-3">
          {isMobile && onBackToUsers && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToUsers}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-medium">
              {selectedUser.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate">{selectedUser.full_name}</p>
            <p className="text-sm text-muted-foreground truncate">@{selectedUser.username}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-96 lg:h-[60vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] lg:max-w-xs lg:max-w-md px-3 lg:px-4 py-2 rounded-lg ${
                  message.sender_id === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={onSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
