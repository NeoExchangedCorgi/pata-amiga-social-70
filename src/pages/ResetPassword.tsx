
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Verificar se há parâmetros de recuperação de senha na URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (accessToken && refreshToken && type === 'recovery') {
      setIsValidSession(true);
      // Definir a sessão usando os tokens da URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } else {
      // Verificar se já existe uma sessão válida
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsValidSession(true);
        } else {
          toast({
            title: "Sessão inválida",
            description: "Link de recuperação expirado ou inválido.",
            variant: "destructive",
          });
          navigate('/forgot-password');
        }
      });
    }
  }, [searchParams, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
        });
      } else {
        toast({
          title: "Senha redefinida com sucesso!",
          description: "Sua senha foi alterada. Você será redirecionado para o login.",
          className: "bg-green-500 text-white border-green-600",
        });
        
        // Fazer logout para limpar a sessão e redirecionar para login
        await supabase.auth.signOut();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno do servidor. Tente novamente.",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
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
            Nova senha
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Nova senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua nova senha"
                  required
                  className="border-foreground/20 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua nova senha"
                  required
                  className="border-foreground/20 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Sua nova senha deve ter:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Pelo menos 6 caracteres</li>
                <li>Uma combinação de letras e números (recomendado)</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
