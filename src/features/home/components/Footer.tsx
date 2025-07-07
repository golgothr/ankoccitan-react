import { Link } from '@tanstack/react-router';
import { FaBookOpen, FaEnvelope, FaGithub, FaTwitter, FaHeart } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-4 right-4 text-orange-500 opacity-20 animate-pulse">
        <FaHeart className="w-4 h-4" />
      </div>
      <div className="absolute bottom-4 left-4 text-red-500 opacity-20 animate-pulse delay-1000">
        <FaHeart className="w-3 h-3" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <FaBookOpen className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-bold">Ankòccitan</span>
            </div>
            <p className="text-gray-300 mb-3 max-w-md text-sm leading-relaxed">
              La plateforme collaborative pour apprendre l'occitan avec Anki. 
              Créez, partagez et maîtrisez cette langue emblématique.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="mailto:contact@ankoccitan.fr" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaEnvelope className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-base font-semibold mb-3">Liens rapides</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/auth" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Créer un compte
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Découvrir Anki
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Culture occitane
                </a>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="text-base font-semibold mb-3">Informations</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="mailto:contact@ankoccitan.fr" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">
              © 2024 Ankòccitan. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-xs mt-2 md:mt-0 flex items-center space-x-1">
              <span>Fait avec</span>
              <FaHeart className="text-red-400 w-3 h-3" />
              <span>pour la langue occitane</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 