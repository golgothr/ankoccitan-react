import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { WhyAnkiSection } from './components/WhyAnkiSection';
import { OccitanPromotionSection } from './components/OccitanPromotionSection';
import { Footer } from './components/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WhyAnkiSection />
        <OccitanPromotionSection />
      </main>
      <Footer />
    </div>
  );
} 