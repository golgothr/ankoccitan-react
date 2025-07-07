import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { WhyAnkiSection } from '../components/WhyAnkiSection';
import { OccitanPromotionSection } from '../components/OccitanPromotionSection';

describe('HomePage Components', () => {
  it('devrait afficher le titre principal dans HeroSection', () => {
    render(<HeroSection />);
    
    expect(screen.getByText(/Ankòccitan, kézaco \?/)).toBeInTheDocument();
  });

  it('devrait afficher le sous-titre dans HeroSection', () => {
    render(<HeroSection />);
    
    expect(screen.getByText(/Crée et partage de formidables decks Anki/)).toBeInTheDocument();
  });

  it('devrait afficher le bouton CTA dans HeroSection', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('Commencer maintenant')).toBeInTheDocument();
  });

  it('devrait afficher la section des fonctionnalités', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('Nos fonctionnalités clés')).toBeInTheDocument();
  });

  it('devrait afficher la section "Pourquoi utiliser Anki ?"', () => {
    render(<WhyAnkiSection />);
    
    expect(screen.getByText('Pourquoi utiliser Anki ?')).toBeInTheDocument();
  });

  it('devrait afficher la section de promotion de l\'occitan', () => {
    render(<OccitanPromotionSection />);
    
    expect(screen.getByText('Préservons la langue occitane')).toBeInTheDocument();
  });
}); 