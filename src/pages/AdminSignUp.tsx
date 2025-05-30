
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Home } from 'lucide-react';
import SignUpForm from '@/components/SignUpForm';

interface SignUpFormData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const AdminSignUp = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleFormSubmit = async (formData: SignUpFormData) => {
    // TODO: Implementar lógica específica para cadastro de admin
    toast({
      title: "Cadastro de Administrador",
      description: "Funcionalidade em desenvolvimento - backend necessário",
      className: "bg-blue-500 text-white border-blue-600",
    });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-lg">Carregando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
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

      <div className="flex items-center justify-center px-4 py-8 min-h-screen">
        <div className="w-full max-w-4xl">
          <Card className="border-foreground/20 shadow-lg">
            <CardHeader className="text-center">
              <img 
                src={theme === 'dark' ? "/lovable-uploads/00b1e86b-2813-433a-9aea-d914e445fe0a.png" : "/lovable-uploads/93af301e-74f3-46b0-8935-2af2039cabcf.png"}
                alt="Paraíso dos Focinhos" 
                className="h-16 w-auto mx-auto mb-4"
              />
              <CardTitle className="text-2xl font-bold text-foreground">
                Cadastro de Administrador - Pata Amiga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SignUpForm onSubmit={handleFormSubmit} />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Já possui cadastro como admin?{' '}
                  <Link 
                    to="/admin/login" 
                    className="text-primary hover:underline font-medium"
                  >
                    Faça o Login aqui!
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
