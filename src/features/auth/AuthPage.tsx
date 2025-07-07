import { Link } from '@tanstack/react-router'
import logo from '@/assets/logo.png'

export function AuthPage() {
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
            Authentification
          </h2>
          <p className="text-gray-600">
            L'authentification sera bientôt disponible avec Supabase
          </p>
        </div>

        {/* Message informatif */}
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="mb-6">
            <svg className="mx-auto h-12 w-12 text-occitan-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fonctionnalité en cours de développement
          </h3>
          
          <p className="text-gray-600 mb-6">
            Nous travaillons actuellement sur l'intégration de Supabase pour l'authentification. 
            Cette fonctionnalité sera bientôt disponible !
          </p>
          
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-occitan-red to-occitan-orange hover:from-occitan-orange hover:to-occitan-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange transition-all duration-200"
            >
              Voir le Dashboard (Démo)
            </Link>
            
            <Link
              to="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange transition-all duration-200"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Liens légaux */}
        <div className="text-center text-sm text-gray-500">
          <p>
            En continuant, vous acceptez nos{' '}
            <Link 
              to="/terms" 
              className="text-occitan-red hover:text-occitan-orange underline transition-colors duration-200"
            >
              conditions d'utilisation
            </Link>{' '}
            et notre{' '}
            <Link 
              to="/privacy" 
              className="text-occitan-red hover:text-occitan-orange underline transition-colors duration-200"
            >
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 