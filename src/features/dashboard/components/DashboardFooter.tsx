import { Link } from '@tanstack/react-router';

export function DashboardFooter() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-orange-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Liens utiles */}
          <div className="flex items-center space-x-6">
            <button
              className="text-sm text-gray-600 hover:text-occitan-orange transition-colors duration-200"
            >
              Documentation
            </button>
            <button
              className="text-sm text-gray-600 hover:text-occitan-orange transition-colors duration-200"
            >
              Support
            </button>
            <a
              href="mailto:contact@ankoccitan.com"
              className="text-sm text-gray-600 hover:text-occitan-orange transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          {/* Version et copyright */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Version 1.0.0
            </span>
            <span className="text-sm text-gray-500">
              © 2024 Ankòccitan. Tous droits réservés.
            </span>
          </div>
        </div>

        {/* Liens légaux */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Link
                to="/terms"
                className="text-xs text-gray-500 hover:text-occitan-orange transition-colors duration-200"
              >
                Conditions d'utilisation
              </Link>
              <Link
                to="/privacy"
                className="text-xs text-gray-500 hover:text-occitan-orange transition-colors duration-200"
              >
                Politique de confidentialité
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Fait avec</span>
              <svg className="h-4 w-4 text-occitan-red" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xs text-gray-400">en Occitanie</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 