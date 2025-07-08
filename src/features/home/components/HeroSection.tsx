import { FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      {/* Emojis éducatifs en décor, nombreux, même opacité */}
      {[
        { emoji: '📚', pos: 'left-8 top-4', size: 'text-7xl', rot: 'rotate-6' },
        { emoji: '🎓', pos: 'right-16 top-10', size: 'text-6xl', rot: '-rotate-12' },
        { emoji: '✏️', pos: 'left-1/3 bottom-10', size: 'text-5xl', rot: 'rotate-12' },
        { emoji: '📖', pos: 'right-1/4 bottom-20', size: 'text-8xl', rot: '-rotate-6' },
        { emoji: '📝', pos: 'left-2/3 top-20', size: 'text-4xl', rot: 'rotate-3' },
        { emoji: '📐', pos: 'right-8 bottom-8', size: 'text-5xl', rot: '-rotate-15' },
        { emoji: '🖍️', pos: 'left-24 top-32', size: 'text-6xl', rot: 'rotate-12' },
        { emoji: '🖊️', pos: 'right-1/2 top-16', size: 'text-5xl', rot: '-rotate-6' },
        { emoji: '📒', pos: 'left-1/4 bottom-2', size: 'text-7xl', rot: 'rotate-3' },
        { emoji: '📏', pos: 'right-1/3 bottom-4', size: 'text-6xl', rot: 'rotate-12' },
        { emoji: '📔', pos: 'left-1/2 top-1/4', size: 'text-5xl', rot: '-rotate-12' },
        { emoji: '🖋️', pos: 'right-20 bottom-24', size: 'text-4xl', rot: 'rotate-6' },
      ].map(({ emoji, pos, size, rot }, i) => (
        <span
          key={i}
          className={`
            absolute ${pos} ${size} ${rot} opacity-30
            select-none pointer-events-none
            hidden sm:block
          `}
        >
          {emoji}
        </span>
      ))}

      <div className="max-w-3xl mx-auto mt-12 relative z-10">
        {/* Glassmorphism wrapper */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/30 text-center">
          {/* Titre principal avec animation glow sur kézaco */}
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            Ankòccitan,{' '}
            <span 
              className="text-occitan-red animate-pulse"
              style={{ 
                letterSpacing: '0.01em',
                textShadow: '0 0 10px rgba(215, 38, 56, 0.6)'
              }}
            >
              kézaco ?
            </span>
          </h1>
          
          {/* Sous-titre */}
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Votre générateur de cartes ANKI pour l'Occitan
          </p>
          
          {/* Bouton principal */}
          <Link
            to="/auth?mode=register"
            className="inline-flex items-center bg-gradient-to-r from-orange-400 to-red-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
          >
            <FaRocket className="mr-2" />
            Commencer maintenant
          </Link>
        </div>
      </div>
    </section>
  );
} 