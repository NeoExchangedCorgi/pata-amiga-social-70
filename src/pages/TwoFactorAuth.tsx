
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AuthHeader from '@/components/AuthHeader';
import OTPVerification from '@/components/OTPVerification';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const userData = location.state?.userData;

  const handleVerify = (code: string) => {
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
      <Card className="w-full max-w-md border-foreground/20">
        <CardHeader>
          <AuthHeader title="Verificação 2FA" />
        </CardHeader>
        
        <CardContent>
          <OTPVerification
            email={userData?.email}
            onVerify={handleVerify}
            onResendCode={handleResendCode}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuth;
