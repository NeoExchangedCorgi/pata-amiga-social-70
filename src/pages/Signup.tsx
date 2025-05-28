
import React from 'react';
import { Navigate } from 'react-router-dom';
import SignUpForm from '@/components/SignUpForm';
import AuthHeader from '@/components/AuthHeader';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const { user, isLoading } = useAuth();

  // Force refresh if user lands here after profile deletion
  React.useEffect(() => {
    const hasDeletedProfile = sessionStorage.getItem('profile_deleted');
    if (hasDeletedProfile) {
      sessionStorage.removeItem('profile_deleted');
      window.location.reload();
    }
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-lg">Carregando...</div>
    </div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
