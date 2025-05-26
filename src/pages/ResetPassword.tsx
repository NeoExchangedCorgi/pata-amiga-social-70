import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Moon, Sun, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { THEME_CONFIG, APP_CONFIG, ROUTES } from '@/constants/app';

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
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verificar se há parâmetros de recuperação de senha na URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('URL params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type, error, errorDescription });

        // Se há erro nos parâmetros da URL
        if (error) {
          setSessionError(errorDescription || 'Link de recuperação inválido ou expirado');
          setIsLoading(false);
          return;
        }

        if (accessToken && refreshToken && type === 'recovery') {
          try {
            // Tentar definir a sessão usando os tokens da URL
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error('Session error:', sessionError);
              setSessionError('Token de recuperação inválido ou expirado');
            } else if (data.session) {
              console.log('Session set successfully');
              setIsValidSession(true);
            } else {
              setSessionError('Não foi possível estabelecer a sessão');
            }
          } catch (err) {
            console.error('Error setting session:', err);
            setSessionError('Erro ao processar o token de recuperação');
          }
        } else {
          // Verificar se já existe uma sessão válida
          const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
          
          if (getSessionError) {
            console.error('Get session error:', getSessionError);
            setSessionError('Erro ao verificar a sessão');
          } else if (session) {
            console.log('Existing session found');
            setIsValidSession(true);
          } else {
            setSessionError('Link de recuperação inválido ou expirado');
          }
        }
      } catch (err) {
        console.error('General error:', err);
        setSessionError('Erro interno. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [searchParams]);

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

    if (formData.password.length < APP_CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
      toast({
        title: "Erro",
        description: `A senha deve ter pelo menos ${APP_CONFIG.VALIDATION.MIN_PASSWORD_LENGTH} caracteres.`,
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
        
        await supabase.auth.signOut();
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000);
      }
    } catch (error) {
      console.error('Update password error:', error);
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

  const logoSrc = theme === 'dark' ? THEME_CONFIG.LOGO_DARK : THEME_CONFIG.LOGO_LIGHT;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando link de recuperação...</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
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
              src={logoSrc}
              alt="Paraíso dos Focinhos" 
              className="h-16 w-auto mx-auto"
            />
            <div className="flex items-center justify-center space-x-2 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <CardTitle className="text-xl font-bold">
                Link Inválido
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {sessionError}
            </p>
            <p className="text-sm text-muted-foreground">
              Possíveis causas:
            </p>
            <ul className="text-sm text-muted-foreground text-left list-disc list-inside space-y-1">
              <li>O link expirou (válido por 1 hora)</li>
              <li>O link já foi usado</li>
              <li>O link está mal formatado</li>
            </ul>
            
            <div className="space-y-2 pt-4">
              <Link to={ROUTES.FORGOT_PASSWORD}>
                <Button className="w-full">
                  Solicitar novo link
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" className="w-full">
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
            src={logoSrc}
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
                <li>Pelo menos {APP_CONFIG.VALIDATION.MIN_PASSWORD_LENGTH} caracteres</li>
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
