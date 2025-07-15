import { useAuth } from '@/core/hooks/useAuth';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-5xl font-bold text-occitan-red mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">Page non trouvée</p>
      <Link
        to={isLoggedIn ? '/dashboard' : '/'}
        className="text-occitan-orange underline hover:text-occitan-red transition-colors duration-200"
      >
        {isLoggedIn ? 'Retour au dashboard' : "Retour à l'accueil"}
      </Link>
    </div>
  );
}

export default NotFoundPage;
