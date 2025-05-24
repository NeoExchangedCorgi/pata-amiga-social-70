
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio?: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (loginData: { username: string; email: string; password: string }) => boolean;
  logout: () => void;
  signup: (userData: Omit<User, 'joinDate'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signup = (userData: Omit<User, 'joinDate'>) => {
    const newUser: User = {
      ...userData,
      joinDate: new Date().toISOString(),
    };
    // Simular salvamento no localStorage
    localStorage.setItem('userData', JSON.stringify(newUser));
    console.log('Usuário cadastrado:', newUser);
  };

  const login = (loginData: { username: string; email: string; password: string }): boolean => {
    // Simular verificação dos dados
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.username === loginData.username && userData.email === loginData.email) {
        setUser(userData);
        console.log('Login realizado com sucesso:', userData);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    console.log('Logout realizado');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      signup,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
