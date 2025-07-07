import { FaHeart, FaUsers, FaGlobe, FaBook, FaStar } from 'react-icons/fa';
import { CallToAction } from './CallToAction';
import { AnimatedCounter } from './AnimatedCounter';
import blason from '@/assets/blason_occitanie.png';

const stats = [
  {
    icon: FaBook,
    value: 1000,
    label: 'Decks créés',
  },
  {
    icon: FaUsers,
    value: 500,
    label: 'Apprenants actifs',
  },
  {
    icon: FaGlobe,
    value: 50,
    label: 'Dialectes couverts',
  },
];

export function OccitanPromotionSection() {
  return (
    <section className="w-full py-10 bg-gradient-to-r from-occitan-red to-occitan-orange text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-4 right-4 text-occitan-yellow opacity-30 animate-bounce">
        <FaStar className="w-6 h-6" />
      </div>
      <div className="absolute bottom-4 left-4 text-occitan-yellow opacity-30 animate-bounce delay-1000">
        <FaStar className="w-4 h-4" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        {/* Titre principal centré */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="relative group">
              <div className="absolute -inset-2 bg-occitan-yellow rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-10 h-10 bg-occitan-yellow rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaHeart className="text-occitan-red text-lg" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">
            Préservons la <span className="text-occitan-yellow">langue occitane</span>
          </h2>
          <p className="text-lg leading-relaxed text-red-100 max-w-2xl mx-auto">
            Que ce soit pour vos études, pour renouer avec vos racines ou tout simplement par curiosité, 
            chaque deck créé ou partagé aide à faire vivre cette langue emblématique.
          </p>
        </div>

        {/* Contenu principal en grille responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-6">
          {/* Colonne gauche : blason sans fond */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute -inset-3 bg-occitan-yellow rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src={blason} 
                alt="Blason de l'Occitanie" 
                className="relative w-32 h-32 rounded-full object-cover group-hover:scale-105 transition-transform duration-300 shadow-xl" 
              />
            </div>
          </div>

          {/* Colonne droite : boutons d'action */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <div className="relative group">
                <div className="absolute -inset-1 bg-white rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <CallToAction
                  text="Créer mon premier deck"
                  variant="secondary"
                  size="md"
                  className="relative hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-occitan-yellow rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <CallToAction
                  text="Découvrir la culture occitane"
                  variant="outline"
                  size="md"
                  className="relative hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques modernisées avec compteurs animés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group text-center">
                <div className="relative p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 border border-white/20 hover-lift">
                  {/* Effet de glow au hover */}
                  <div className="absolute -inset-1 bg-occitan-yellow rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                  
                  <div className="relative">
                    {/* Icône */}
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-occitan-yellow rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Icon className="text-occitan-red text-sm" />
                      </div>
                    </div>
                    
                    {/* Valeur avec compteur animé */}
                    <div className="text-2xl mb-1 group-hover:text-occitan-yellow transition-colors duration-300">
                      <AnimatedCounter 
                        end={stat.value} 
                        duration={2000 + index * 500}
                        className="text-occitan-yellow"
                      />
                    </div>
                    
                    {/* Label */}
                    <div className="text-red-100 text-xs font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 