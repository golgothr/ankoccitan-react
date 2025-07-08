import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { WhyAnkiSection } from './components/WhyAnkiSection';
import { OccitanPromotionSection } from './components/OccitanPromotionSection';
import { Footer } from './components/Footer';
import { SupabaseTest } from '@/components/SupabaseTest';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WhyAnkiSection />
        <OccitanPromotionSection />
        {/* Test de configuration - à retirer en production */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SupabaseTest />
        </div>
      </main>
      <Footer />
    </div>
  );
} 