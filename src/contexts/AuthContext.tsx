
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';

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
  const { signupUser, loginUser, logoutUser } = useAuthActions();

  const signup = (userData: Omit<User, 'joinDate'>) => {
    signupUser(userData);
  };

  const login = (loginData: { username: string; email: string; password: string }): boolean => {
    const userData = loginUser(loginData);
    if (userData) {
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    logoutUser();
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
