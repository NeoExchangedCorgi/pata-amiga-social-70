
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Send, MessageCircle } from 'lucide-react';
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

  useEffect(() => {
    // Aguardar o carregamento da autenticação antes de verificar
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, isLoading]);

  // Aguardar o contexto de autenticação carregar
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
        // Admin vê todos os usuários
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('user_type', 'user');

        if (error) throw error;
        setUsers(data || []);
      } else {
        // Usuário comum só vê admins
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

      // Marcar mensagens como lidas
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
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Mostrar carregamento enquanto verifica autenticação
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
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isAdmin ? 'Chat Administrativo' : 'Chat com a ONG'}
              </h1>
              <p className="text-muted-foreground">
                {isAdmin 
                  ? 'Converse com os usuários que precisam de ajuda'
                  : 'Entre em contato com nossa equipe'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Lista de usuários */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>{isAdmin ? 'Usuários' : 'Administradores'}</span>
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {filteredUsers.map((chatUser) => (
                      <div
                        key={chatUser.id}
                        onClick={() => selectUser(chatUser)}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedUser?.id === chatUser.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {chatUser.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{chatUser.full_name}</p>
                            <p className="text-sm text-muted-foreground">@{chatUser.username}</p>
                          </div>
                          {chatUser.has_unread_messages && (
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Área de chat */}
              <Card className="lg:col-span-2">
                {selectedUser ? (
                  <>
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {selectedUser.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p>{selectedUser.full_name}</p>
                          <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col h-96">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender_id === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{message.message}</p>
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
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={sendMessage} size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Selecione um usuário para começar a conversar
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default Chat;
