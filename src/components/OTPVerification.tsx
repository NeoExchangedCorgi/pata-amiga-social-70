
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationProps {
  email?: string;
  onVerify: (code: string) => void;
  onResendCode: () => void;
  onCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResendCode,
  onCancel
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState('');

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

    onVerify(code);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm text-center">
        Digite o código de 6 dígitos enviado para {email || 'seu e-mail'}
      </p>

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
          onClick={onResendCode}
          className="text-primary hover:underline"
        >
          Reenviar código
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={onCancel}
        className="w-full border-foreground/20"
      >
        Cancelar e voltar ao início
      </Button>
    </div>
  );
};

export default OTPVerification;
