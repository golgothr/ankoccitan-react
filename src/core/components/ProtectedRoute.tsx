import React from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/core/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = '/auth' 
}) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Rediriger vers la page de connexion en conservant l'URL de destination
    return (
      <Navigate 
        to={fallbackPath} 
        search={{ 
          redirect: location.pathname + location.search 
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
}; 