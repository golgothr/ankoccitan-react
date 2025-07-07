import { FaRocket, FaStar, FaHeart } from 'react-icons/fa';
import { CallToAction } from './CallToAction';

export function HeroSection() {
  return (
    <section className="w-full pt-20 pb-12 text-center relative overflow-hidden bg-gradient-to-br from-occitan-cream via-white to-occitan-light">
      {/* Éléments décoratifs subtils */}
      <div className="absolute top-8 left-8 w-12 h-12 bg-occitan-yellow rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 bg-occitan-red rounded-full opacity-10 animate-pulse delay-1000"></div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Titre principal avec animation de couleur */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3">
              Ankòccitan,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-occitan-red via-occitan-orange to-occitan-yellow animate-gradient-x">
                kézaco ?
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-2 text-occitan-orange">
              <FaHeart className="w-4 h-4 animate-pulse" />
              <span className="text-base font-medium">La langue occitane à portée de main</span>
              <FaHeart className="w-4 h-4 animate-pulse delay-500" />
            </div>
          </div>

          {/* Sous-titre avec effet de révélation */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Crée et partage de <span className="font-semibold text-occitan-red">formidables decks Anki</span> pour apprendre l'occitan
          </p>

          {/* Bouton CTA avec effet moderne */}
          <div className="relative group animate-fade-in animation-delay-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-occitan-red to-occitan-orange rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <CallToAction
              text="Commencer maintenant"
              href="/auth"
              variant="primary"
              size="lg"
              icon={<FaRocket />}
              className="relative hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Badge de confiance avec compteurs */}
          <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-500 animate-fade-in animation-delay-500">
            <div className="flex items-center space-x-1">
              <FaStar className="text-occitan-yellow" />
              <span><span className="font-bold text-occitan-red">1000+</span> decks créés</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <FaHeart className="text-occitan-red" />
              <span><span className="font-bold text-occitan-red">500+</span> apprenants</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 