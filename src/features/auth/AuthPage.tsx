import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import logo from '@/assets/logo.png';

// Types pour les paramètres de recherche
interface AuthSearchParams {
  mode?: 'login' | 'register';
  redirect?: string;
}

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const location = useLocation();
  // Lecture des query params
  const params = new URLSearchParams(location.search);
  const modeParam = params.get('mode');
  const redirectParam = params.get('redirect');

  // Déterminer le mode initial depuis l'URL
  useEffect(() => {
    if (modeParam === 'register') {
      setMode('register');
    } else {
      setMode('login');
    }
  }, [modeParam]);

  const handleAuthSuccess = () => {
    const fallback = '/dashboard';
    const redirectTo = typeof redirectParam === 'string' && redirectParam.startsWith('/')
      ? redirectParam
      : fallback;
    if (redirectTo === '/auth' || redirectTo === '/login' || redirectTo === '/404') {
      console.log('[AuthPage] Redirection protégée vers /dashboard');
      navigate(fallback);
      return;
    }
    try {
      console.log('[AuthPage] Redirection vers', redirectTo);
      navigate(redirectTo);
    } catch (err) {
      console.error('[AuthPage] Redirection échouée', err);
      navigate(fallback);
    }
  };

  const handleAuthError = (error: string) => {
    console.error('Erreur d\'authentification:', error);
    // Ici on pourrait afficher une notification d'erreur
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="Logo Ankòccitan" 
              className="h-16 w-16 transition-transform duration-300 hover:scale-110" 
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Connectez-vous à votre compte Ankòccitan' 
              : 'Rejoignez la communauté Ankòccitan'
            }
          </p>
        </div>

        {/* Toggle entre connexion et inscription */}
        <div className="bg-white rounded-lg p-1 shadow-sm">
          <div className="flex">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-occitan-red to-occitan-orange text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-occitan-red to-occitan-orange text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Inscription
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          {mode === 'login' ? (
            <LoginForm 
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          )}
        </div>

        {/* Liens légaux */}
        <div className="text-center text-sm text-gray-500">
          <p>
            En continuant, vous acceptez nos{' '}
            <a 
              href="/terms" 
              className="text-occitan-red hover:text-occitan-orange underline transition-colors duration-200"
            >
              conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a 
              href="/privacy" 
              className="text-occitan-red hover:text-occitan-orange underline transition-colors duration-200"
            >
              politique de confidentialité
            </a>
          </p>
        </div>

        {/* Bouton retour accueil */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-block px-4 py-2 bg-gray-200 rounded hover:bg-orange-100 text-occitan-red font-semibold transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
} 