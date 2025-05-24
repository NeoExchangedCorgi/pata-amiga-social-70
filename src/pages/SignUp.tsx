
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AuthHeader from '@/components/AuthHeader';
import SignUpForm from '@/components/SignUpForm';

interface SignUpFormData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleFormSubmit = (formData: SignUpFormData) => {
    signup({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
    });
    
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Agora você pode fazer login com suas credenciais.",
      className: "bg-green-500 text-white border-green-600",
    });
    
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-foreground/20">
        <CardHeader>
          <AuthHeader title="Cadastro - Pata Amiga" />
        </CardHeader>
        
        <CardContent>
          <SignUpForm onSubmit={handleFormSubmit} />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Possui cadastro?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Faça o Login aqui!
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
