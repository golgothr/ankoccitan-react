import { FaEdit, FaFileUpload, FaUsers, FaCog, FaStar } from 'react-icons/fa';

const features = [
  {
    icon: FaEdit,
    title: 'Création manuelle',
    description: 'Crée des cartes uniques avec traduction, audio et images en quelques clics.',
  },
  {
    icon: FaFileUpload,
    title: 'Import en masse',
    description: 'Gagne du temps avec l\'import TXT/CSV et la traduction automatique.',
  },
  {
    icon: FaUsers,
    title: 'Communauté',
    description: 'Explore et télécharge les decks partagés par les autres apprenants.',
  },
  {
    icon: FaCog,
    title: 'Paramètres personnalisés',
    description: 'Choisis ton dialecte préféré et configure tes clés API facilement.',
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-12 bg-gradient-to-br from-occitan-light via-white to-occitan-cream relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-6 left-6 text-occitan-orange opacity-30 animate-bounce">
        <FaStar className="w-6 h-6" />
      </div>
      <div className="absolute bottom-6 right-6 text-occitan-red opacity-30 animate-bounce delay-1000">
        <FaStar className="w-4 h-4" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        {/* Titre principal centré */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-occitan-red to-occitan-orange">fonctionnalités</span> clés
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tout ce dont vous avez besoin pour maîtriser l'occitan avec Anki
          </p>
        </div>

        {/* Grille des fonctionnalités avec cartes interactives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover-lift">
                  {/* Effet de glow au hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-occitan-red to-occitan-orange rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                  
                  <div className="relative">
                    {/* Icône avec conteneur moderne */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-occitan-red to-occitan-orange rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Icon className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-occitan-red transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action centré */}
        <div className="text-center">
          <div className="relative group inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-occitan-red to-occitan-orange rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <a
              href="/auth"
              className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-occitan-red to-occitan-orange text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg hover:scale-105 transform"
            >
              Commencer maintenant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 