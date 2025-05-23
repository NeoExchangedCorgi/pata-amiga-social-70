
import React from 'react';
import { Phone, Mail, Facebook, Instagram, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const OngInfoScreen = () => {
  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Informações da ONG</h1>
        </div>

        <Card className="border-foreground/20">
          <CardHeader>
            <CardTitle className="text-foreground">
              Paraíso dos Focinhos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              ONG sem fins lucrativos, fundada em 2011, dedicada ao resgate, proteção e cuidado de animais de rua no Rio de Janeiro.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-foreground">
                <Phone className="h-5 w-5" />
                <span>(21) 97609-0612</span>
              </div>
              
              <div className="flex items-center space-x-3 text-foreground">
                <Mail className="h-5 w-5" />
                <span className="break-all">contato@paraisodosfocinhos.com.br</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="default" 
                className="w-full justify-start border-foreground/20 text-foreground hover:bg-foreground/10"
                onClick={() => window.open('https://www.facebook.com/ongparaisodosfocinhos/', '_blank')}
              >
                <Facebook className="mr-3 h-5 w-5" />
                Facebook
              </Button>
              
              <Button 
                variant="outline" 
                size="default" 
                className="w-full justify-start border-foreground/20 text-foreground hover:bg-foreground/10"
                onClick={() => window.open('https://www.instagram.com/ongparaisodosfocinhos/', '_blank')}
              >
                <Instagram className="mr-3 h-5 w-5" />
                Instagram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OngInfoScreen;
