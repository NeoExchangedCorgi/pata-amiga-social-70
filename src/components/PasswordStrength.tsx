
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  onPasswordGenerate: (password: string) => void;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, onPasswordGenerate }) => {
  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('');
  const [strengthColor, setStrengthColor] = useState('');

  const calculateStrength = (pwd: string) => {
    let score = 0;
    const requirements = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };

    // Score calculation
    if (requirements.length) score += 20;
    if (requirements.lowercase) score += 20;
    if (requirements.uppercase) score += 20;
    if (requirements.numbers) score += 20;
    if (requirements.symbols) score += 20;

    return { score, requirements };
  };

  const generateStrongPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*(),.?":{}|<>';
    
    let password = '';
    
    // Garantir pelo menos um caractere de cada tipo
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Completar até 12 caracteres
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Embaralhar a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setStrengthText('');
      setStrengthColor('');
      return;
    }

    const { score } = calculateStrength(password);
    setStrength(score);

    if (score < 40) {
      setStrengthText('Fraca');
      setStrengthColor('bg-red-500');
    } else if (score < 60) {
      setStrengthText('Regular');
      setStrengthColor('bg-yellow-500');
    } else if (score < 80) {
      setStrengthText('Boa');
      setStrengthColor('bg-blue-500');
    } else {
      setStrengthText('Forte');
      setStrengthColor('bg-green-500');
    }
  }, [password]);

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    onPasswordGenerate(newPassword);
  };

  if (!password) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGeneratePassword}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Gerar senha forte
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Força da senha:</span>
        <span className={`text-sm font-medium ${strengthColor.replace('bg-', 'text-')}`}>
          {strengthText}
        </span>
      </div>
      <Progress value={strength} className="h-2" />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGeneratePassword}
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Gerar senha forte
      </Button>
    </div>
  );
};

export default PasswordStrength;
