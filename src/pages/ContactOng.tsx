
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Facebook, Instagram, MapPin, Heart, Users, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import FooterBar from '@/components/FooterBar';

const ContactOng = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="text-center mb-8">
              <img 
                src={theme === 'dark' ? "/lovable-uploads/00b1e86b-2813-433a-9aea-d914e445fe0a.png" : "/lovable-uploads/93af301e-74f3-46b0-8935-2af2039cabcf.png"}
                alt="Paraíso dos Focinhos" 
                className="h-24 w-auto mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-foreground mb-2">Paraíso dos Focinhos</h1>
              <p className="text-lg text-muted-foreground">
                ONG sem fins lucrativos dedicada ao resgate e cuidado de animais
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Contato</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>(21) 97609-0612</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>contato@paraisodosfocinhos.com.br</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Rio de Janeiro, RJ</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Nossa Missão</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Promover o bem-estar animal através do resgate, tratamento veterinário, 
                    reabilitação e adoção responsável de cães e gatos em situação de risco. 
                    Trabalhamos incansavelmente para dar uma segunda chance a animais abandonados e maltratados.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Como Ajudar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>• <strong>Adoção:</strong> Dê um lar para um animal resgatado</div>
                  <div>• <strong>Voluntariado:</strong> Ajude nos cuidados e eventos</div>
                  <div>• <strong>Doações:</strong> Ração, medicamentos e materiais</div>
                  <div>• <strong>Divulgação:</strong> Compartilhe nosso trabalho</div>
                  <div>• <strong>Denúncias:</strong> Reporte casos de maus-tratos</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Estatísticas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>• <strong>+500</strong> animais resgatados</div>
                  <div>• <strong>+400</strong> adoções realizadas</div>
                  <div>• <strong>+50</strong> voluntários ativos</div>
                  <div>• <strong>8 anos</strong> de trabalho dedicado</div>
                  <div>• <strong>24/7</strong> atendimento emergencial</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais e Site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://www.paraisodosfocinhos.com.br/', '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <span>Site Oficial</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://www.facebook.com/ongparaisodosfocinhos/', '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://www.instagram.com/ongparaisodosfocinhos/', '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sobre Esta Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Esta plataforma foi criada para conectar pessoas que se importam com o bem-estar animal. 
                  Aqui você pode:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Postar sobre animais em situações críticas que precisam de ajuda</li>
                  <li>• Compartilhar casos de resgate e recuperação</li>
                  <li>• Encontrar animais para adoção</li>
                  <li>• Conectar-se com outros amantes de animais</li>
                  <li>• Denunciar casos de maus-tratos</li>
                  <li>• Buscar apoio da comunidade para casos urgentes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <FooterBar />
    </div>
  );
};

export default ContactOng;
