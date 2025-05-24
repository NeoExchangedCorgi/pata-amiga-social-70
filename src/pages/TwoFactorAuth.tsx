
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Moon, Sun, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [code, setCode] = useState('');

  // Pegar dados do usuário da navegação anterior
  const userData = location.state?.userData;

  const handleVerify = () => {
    if (code.length !== 6) {
      toast({
        title: "Código inválido",
        description: "Por favor, digite um código de 6 dígitos.",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
      return;
    }

    // Simular verificação do código 2FA
    // Em um cenário real, este código seria validado no backend
    if (code === '123456') {
      toast({
        title: "Verificação concluída!",
        description: "Seu cadastro foi finalizado com sucesso.",
        className: "bg-green-500 text-white border-green-600",
      });
      navigate('/login');
    } else {
      toast({
        title: "Código incorreto",
        description: "O código digitado está incorreto. Tente novamente.",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
    }
  };

  const handleResendCode = () => {
    toast({
      title: "Código reenviado",
      description: "Um novo código foi enviado para seu e-mail/SMS.",
      className: "bg-blue-500 text-white border-blue-600",
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="text-foreground hover:bg-foreground/10"
        >
          <Home className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-foreground hover:bg-foreground/10"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      <Card className="w-full max-w-md border-foreground/20">
        <CardHeader className="text-center space-y-4">
          <img 
            src={theme === 'dark' ? "/lovable-uploads/00b1e86b-2813-433a-9aea-d914e445fe0a.png" : "/lovable-uploads/93af301e-74f3-46b0-8935-2af2039cabcf.png"}
            alt="Paraíso dos Focinhos" 
            className="h-16 w-auto mx-auto"
          />
          <CardTitle className="text-2xl font-bold text-foreground">
            Verificação 2FA
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Digite o código de 6 dígitos enviado para {userData?.email || 'seu e-mail'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            onClick={handleVerify}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={code.length !== 6}
          >
            Verificar Código
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Não recebeu o código?
            </p>
            <Button
              variant="ghost"
              onClick={handleResendCode}
              className="text-primary hover:underline"
            >
              Reenviar código
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full border-foreground/20"
          >
            Cancelar e voltar ao início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuth;
