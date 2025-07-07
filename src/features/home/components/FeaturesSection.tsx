import { FaEdit, FaFileUpload, FaUsers, FaCog, FaStar, FaRocket } from 'react-icons/fa';

const features = [
  {
    icon: FaEdit,
    title: 'Création manuelle',
    description: 'Crée des cartes uniques avec traduction, audio et images en quelques clics.',
    iconLabel: 'Icône édition',
  },
  {
    icon: FaFileUpload,
    title: 'Import en masse',
    description: 'Gagne du temps avec l\'import TXT/CSV et la traduction automatique.',
    iconLabel: 'Icône import',
  },
  {
    icon: FaUsers,
    title: 'Communauté',
    description: 'Explore et télécharge les decks partagés par les autres apprenants.',
    iconLabel: 'Icône communauté',
  },
  {
    icon: FaCog,
    title: 'Paramètres personnalisés',
    description: 'Choisis ton dialecte préféré et configure tes clés API facilement.',
    iconLabel: 'Icône paramètres',
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-br from-occitan-light via-white to-occitan-cream relative">
      {/* Éléments décoratifs */}
      <div className="absolute top-6 left-6 text-occitan-orange opacity-30 animate-bounce">
        <FaStar className="w-6 h-6" />
      </div>
      <div className="absolute bottom-6 right-6 text-occitan-red opacity-30 animate-bounce delay-1000">
        <FaStar className="w-4 h-4" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Titre principal centré */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900">
            Nos <span className="text-occitan-red">fonctionnalités</span> clés
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Tout ce dont vous avez besoin pour maîtriser l'occitan avec Anki
          </p>
        </div>

        {/* Grille des fonctionnalités avec cartes neumorphiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="group animate-fade-in" 
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Carte neumorphique */}
                <div className="bg-white rounded-xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] p-6 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.8)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] transform">
                  {/* Icône sur fond dégradé, icône blanche */}
                  <div className="flex-shrink-0 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D72638] to-[#FF9800] rounded-full flex items-center justify-center shadow-lg ring-2 ring-white group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white text-3xl" aria-label={feature.iconLabel} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-occitan-red transition-colors duration-300 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action centré, très visible */}
        <div className="text-center">
          <button
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:ring-offset-2 transform"
            aria-label="Commencer maintenant"
          >
            <FaRocket className="mr-2 text-xl" aria-hidden="true" />
            Commencer maintenant
          </button>
        </div>
      </div>
    </section>
  );
} 