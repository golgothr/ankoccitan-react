import { FaGlobe, FaUsers, FaHeart } from 'react-icons/fa';
import { CallToAction } from './CallToAction';
import blason from '@/assets/blason_occitanie.png';

const metrics = [
  {
    Icon: FaGlobe,
    value: '6',
    label: 'Dialectes principaux',
  },
  {
    Icon: FaUsers,
    value: '600 000',
    label: 'Locuteurs',
  },
  {
    Icon: FaHeart,
    value: '92 %',
    label: 'Soutien populaire',
  },
];

export function OccitanPromotionSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-orange-50 to-white">
      {/* SVG Wave en haut */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-orange-50"
          ></path>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-6 px-6 relative z-10">
        {/* Petit Blason au-dessus du titre */}
        <img
          src={blason}
          alt="Blason de l'Occitanie"
          className="mx-auto w-16 h-16"
        />

        <h2 className="text-4xl font-extrabold text-gray-900">
          Préservons la <span className="text-yellow-600">langue occitane</span>
        </h2>
        <p className="text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
          Que ce soit pour vos études, pour renouer avec vos racines ou par curiosité, chaque deck aide à faire vivre cette langue emblématique.
        </p>

        {/* Metrics glass cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {metrics.map(({ Icon, value, label }, i) => (
            <div
              key={i}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] transform"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <Icon className="w-10 h-10 text-yellow-600 mb-2 mx-auto" />
              <p className="text-3xl font-bold text-yellow-600 mb-1">{value}</p>
              <p className="text-sm text-gray-700">{label}</p>
            </div>
          ))}
        </div>

        {/* Bouton gradient animé */}
        <CallToAction
          text="Créer mon premier deck"
          variant="primary"
          size="md"
          className="mx-auto bg-gradient-to-r from-orange-400 to-red-500 hover:from-red-500 hover:to-orange-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
        />
      </div>
    </section>
  );
} 