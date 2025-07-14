import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsPage } from '../SettingsPage';

// Mock des composants enfants
vi.mock('../components/PexelsApiKeyForm', () => ({
  PexelsApiKeyForm: () => (
    <div data-testid="pexels-api-key-form">Pexels API Key Form</div>
  ),
}));

vi.mock('../components/Toast', () => ({
  Toast: () => <div data-testid="toast">Toast</div>,
}));

describe('SettingsPage', () => {
  it('renders correctly', () => {
    render(<SettingsPage />);

    // Vérifier que le titre principal est présent
    expect(screen.getByText('Paramètres')).toBeInTheDocument();

    // Vérifier que la description est présente
    expect(
      screen.getByText(/Gérez vos préférences et clés API/)
    ).toBeInTheDocument();

    // Vérifier que les sections sont présentes
    expect(screen.getByText('Clés API')).toBeInTheDocument();
    expect(screen.getByText('Préférences')).toBeInTheDocument();

    // Vérifier que le formulaire Pexels est rendu
    expect(screen.getByTestId('pexels-api-key-form')).toBeInTheDocument();
  });

  it('displays correct section descriptions', () => {
    render(<SettingsPage />);

    // Vérifier les descriptions des sections
    expect(
      screen.getByText(
        /Configurez vos clés API pour activer les fonctionnalités avancées/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Personnalisez votre expérience d'apprentissage/)
    ).toBeInTheDocument();
  });
});
