
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock post data - in a real app this would come from an API
  const post = {
    id: id,
    author: 'Maria Silva',
    username: 'maria_defensora',
    content: 'Encontrei um cachorrinho ferido na Rua das Flores, 123. Ele está com uma pata machucada e muito assustado. Alguém pode ajudar com o resgate?',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
    timestamp: '2h',
    likes: 15,
    replies: 3,
    isLiked: false,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            <Card className="border-foreground/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{post.author}</h3>
                      <span className="text-muted-foreground">@{post.username}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center space-x-6 pt-4 border-t border-foreground/10">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.replies}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-foreground/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-4">Comentários</h4>
                <p className="text-muted-foreground">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default PostDetail;
