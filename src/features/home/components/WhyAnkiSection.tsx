import { FaRedo, FaMobile, FaMusic, FaSlidersH, FaStar } from 'react-icons/fa';
import logoAnki from '@/assets/logo_anki_final.png';

const advantages = [
  {
    icon: FaRedo,
    title: 'Répétition Espacée',
    description: 'Révisez intelligemment pour ne jamais oublier.',
  },
  {
    icon: FaMobile,
    title: 'Synchronisation',
    description: 'Vos cartes vous suivent partout, sur tous vos appareils.',
  },
  {
    icon: FaMusic,
    title: 'Support Multimédia',
    description: 'Enrichissez vos cartes avec sons et images.',
  },
  {
    icon: FaSlidersH,
    title: 'Personnalisation',
    description: "Adaptez l'apprentissage à vos propres besoins.",
  },
];

export function WhyAnkiSection() {
  return (
    <section className="w-full py-12 bg-gradient-to-br from-occitan-cream via-white to-occitan-light relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-4 right-8 text-occitan-orange opacity-30 animate-bounce">
        <FaStar className="w-8 h-8" />
      </div>
      <div className="absolute bottom-4 left-8 text-occitan-red opacity-30 animate-bounce delay-1000">
        <FaStar className="w-6 h-6" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        {/* Titre principal centré */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Pourquoi utiliser <span className="text-transparent bg-clip-text bg-gradient-to-r from-occitan-red to-occitan-orange">Anki&nbsp;?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            La méthode scientifique pour un apprentissage efficace et durable
          </p>
        </div>

        {/* Contenu principal en grille responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
          {/* Colonne gauche : logo Anki */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-occitan-red to-occitan-orange rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border border-orange-100 hover:shadow-2xl transition-all duration-300">
                <img src={logoAnki} alt="Logo Anki" className="w-40 h-40 drop-shadow-lg group-hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Colonne droite : liste des avantages */}
          <div className="space-y-4">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/60 transition-all duration-300 hover:shadow-md">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-occitan-red to-occitan-orange rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Icon className="text-white text-lg" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-occitan-red transition-colors duration-300">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouton centré avec effet moderne */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-occitan-red to-occitan-orange rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <a
              href="https://apps.ankiweb.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-occitan-red to-occitan-orange text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg hover:scale-105 transform"
            >
              Découvrir Anki
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 