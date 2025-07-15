import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { useAuth } from '@/core/hooks/useAuth';
import { logger } from '@/core/utils/logger';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
    if (isLoggedIn) {
      logger.log('Utilisateur déjà connecté, redirection vers le dashboard');
      navigate('/dashboard');
      return;
    }

    // Vérifier si on doit afficher le formulaire d'inscription
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    }

    // Vérifier s'il y a une erreur dans les paramètres
    const error = searchParams.get('error');
    if (error) {
      logger.error("Erreur d'authentification:", error);
    }
  }, [isLoggedIn, navigate, searchParams]);

  const handleAuthSuccess = () => {
    logger.log('Authentification réussie, redirection vers le dashboard');
    navigate('/dashboard');
  };

  const handleAuthError = (error: string) => {
    logger.error("Erreur d'authentification:", error);
    // Vous pouvez ajouter ici une logique pour afficher l'erreur
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Mettre à jour l'URL pour refléter le mode
    const newMode = isLogin ? 'register' : 'login';
    navigate(`/auth?mode=${newMode}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {isLogin ? (
          <LoginForm onSuccess={handleAuthSuccess} onError={handleAuthError} />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        )}

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            {isLogin
              ? "Vous n'avez pas de compte ? S'inscrire"
              : 'Vous avez déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
};
