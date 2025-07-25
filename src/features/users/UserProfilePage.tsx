import { useAuth } from '@/core/hooks/useAuth';
import { logger } from '@/core/utils/logger';

export function UserProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Profil non disponible
        </h2>
        <p className="text-gray-600">
          Veuillez vous connecter pour accéder à votre profil.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Profil Utilisateur
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Utilisateur
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.id}</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={async () => {
                try {
                  logger.log('[UserProfilePage] Déconnexion en cours...');
                  await logout();
                  // La redirection est gérée dans la fonction logout
                } catch (error) {
                  logger.error(
                    '[UserProfilePage] Erreur lors de la déconnexion:',
                    error
                  );
                  // Forcer la redirection même en cas d'erreur
                  window.location.href = '/';
                }
              }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
