
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import ChatMobileLayout from '@/components/chat/ChatMobileLayout';
import ChatDesktopLayout from '@/components/chat/ChatDesktopLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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

const Chat = () => {
  const { user, profile, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showUsersList, setShowUsersList] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, isLoading]);

  useEffect(() => {
    if (profile !== null || user !== null) {
      setIsLoading(false);
    }
  }, [profile, user]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      if (isAdmin) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('user_type', 'user');

        if (error) throw error;
        setUsers(data || []);
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('user_type', 'admin');

        if (error) throw error;
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('sender_id', userId)
        .eq('recipient_id', user?.id);

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedUser.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedUser.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive",
      });
    }
  };

  const selectUser = (chatUser: ChatUser) => {
    setSelectedUser(chatUser);
    fetchMessages(chatUser.id);
    setShowUsersList(false);
  };

  const handleBackToUsers = () => {
    setShowUsersList(true);
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto p-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-6"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-6xl mx-auto p-4">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {isAdmin ? 'Chat Administrativo' : 'Chat com a ONG'}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {isAdmin 
                  ? 'Converse com os usuários que precisam de ajuda'
                  : 'Entre em contato com nossa equipe'
                }
              </p>
            </div>

            <ChatMobileLayout
              showUsersList={showUsersList}
              users={users}
              filteredUsers={filteredUsers}
              selectedUser={selectedUser}
              messages={messages}
              newMessage={newMessage}
              searchTerm={searchTerm}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onSearchChange={setSearchTerm}
              onUserSelect={selectUser}
              onBackToUsers={handleBackToUsers}
              onMessageChange={setNewMessage}
              onSendMessage={sendMessage}
            />

            <ChatDesktopLayout
              users={users}
              filteredUsers={filteredUsers}
              selectedUser={selectedUser}
              messages={messages}
              newMessage={newMessage}
              searchTerm={searchTerm}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onSearchChange={setSearchTerm}
              onUserSelect={selectUser}
              onMessageChange={setNewMessage}
              onSendMessage={sendMessage}
            />
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default Chat;
