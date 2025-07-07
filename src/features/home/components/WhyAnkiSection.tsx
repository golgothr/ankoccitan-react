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
    <section className="w-full py-24 bg-gradient-to-r from-white to-orange-50 relative">
      {/* Éléments décoratifs */}
      <div className="absolute top-4 right-8 text-occitan-orange opacity-30 animate-bounce">
        <FaStar className="w-8 h-8" />
      </div>
      <div className="absolute bottom-4 left-8 text-occitan-red opacity-30 animate-bounce delay-1000">
        <FaStar className="w-6 h-6" />
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 items-center gap-12 px-6 relative z-10">
        {/* Logo Card glassmorphique */}
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 flex justify-center shadow-xl border border-white/30">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-occitan-red to-occitan-orange rounded-full blur-lg opacity-20"></div>
            <img src={logoAnki} alt="Logo Anki" className="w-48 h-48 relative z-10 drop-shadow-2xl" />
          </div>
        </div>

        {/* Liste + CTA */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Pourquoi utiliser <span className="text-occitan-red">Anki&nbsp;?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            La méthode scientifique pour un apprentissage efficace et durable
          </p>
          
          <ul className="space-y-4 mb-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <li key={index} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D72638] to-[#FF9800] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-occitan-red transition-colors duration-300">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {advantage.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Bouton CTA */}
          <a
            href="https://apps.ankiweb.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:ring-offset-2 transform"
          >
            Découvrir Anki
          </a>
        </div>
      </div>
    </section>
  );
} 