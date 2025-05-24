
import { useToast } from '@/hooks/use-toast';

interface User {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio?: string;
  joinDate: string;
}

export const useAuthActions = () => {
  const { toast } = useToast();

  const signupUser = (userData: Omit<User, 'joinDate'>) => {
    const newUser: User = {
      ...userData,
      joinDate: new Date().toISOString(),
    };
    localStorage.setItem('userData', JSON.stringify(newUser));
    console.log('Usuário cadastrado:', newUser);
    return newUser;
  };

  const loginUser = (loginData: { username: string; email: string; password: string }): User | null => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.username === loginData.username && userData.email === loginData.email) {
        console.log('Login realizado com sucesso:', userData);
        return userData;
      }
    }
    return null;
  };

  const logoutUser = () => {
    console.log('Logout realizado');
  };

  return {
    signupUser,
    loginUser,
    logoutUser,
  };
};
