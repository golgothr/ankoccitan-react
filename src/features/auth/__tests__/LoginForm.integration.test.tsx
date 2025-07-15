import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockApiError } from '../../../core/test/TestWrapper';
import { LoginForm } from '../components/LoginForm';

// Mock des APIs
vi.mock('../../../core/api', () => ({
  loginUser: vi.fn(),
}));

describe("LoginForm - Tests d'intégration avancés", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Nettoyer localStorage
    localStorage.clear();
  });

  describe('Flux de connexion complet', () => {
    it('devrait gérer le cycle complet de connexion avec succès', async () => {
      // Arrange
      const mockLoginResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          username: 'testuser',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        token: 'mock-jwt-token',
      };

      const { loginUser } = await import('../../../core/api');
      vi.mocked(loginUser).mockResolvedValue(mockLoginResponse);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      // Act
      render(<LoginForm onSuccess={onSuccess} onError={onError} />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      // Remplir le formulaire
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Vérifier que les champs sont remplis
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');

      // Soumettre le formulaire
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });

      // Vérifier que le token est stocké
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth_token',
        'mock-jwt-token'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(mockLoginResponse.user)
      );
    });

    it('devrait gérer les erreurs de connexion avec retry', async () => {
      // Arrange
      const { loginUser } = await import('../../../core/api');

      // Premier appel échoue, deuxième réussit
      vi.mocked(loginUser)
        .mockRejectedValueOnce(mockApiError('Erreur réseau'))
        .mockResolvedValueOnce({
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            username: 'testuser',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          token: 'mock-jwt-token',
        });

      const onError = vi.fn();

      // Act
      render(<LoginForm onError={onError} />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Vérifier l'erreur
      await waitFor(() => {
        expect(screen.getByText(/erreur réseau/i)).toBeInTheDocument();
      });

      expect(onError).toHaveBeenCalledWith('Erreur réseau');

      // Retry
      await user.click(submitButton);

      // Vérifier le succès
      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Validation en temps réel', () => {
    it("devrait valider l'email en temps réel", async () => {
      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);

      // Email invalide
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Déclencher la validation

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/format d'email invalide/i)
        ).toBeInTheDocument();
      });

      // Email valide
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@email.com');
      await user.tab();

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByText(/format d'email invalide/i)
        ).not.toBeInTheDocument();
      });
    });

    it('devrait valider la force du mot de passe', async () => {
      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const passwordInput = screen.getByLabelText(/mot de passe/i);

      // Mot de passe faible
      await user.type(passwordInput, '123');
      await user.tab();

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/au moins 6 caractères/i)).toBeInTheDocument();
      });

      // Mot de passe fort
      await user.clear(passwordInput);
      await user.type(passwordInput, 'StrongPassword123!');
      await user.tab();

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByText(/au moins 6 caractères/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibilité avancée', () => {
    it('devrait supporter la navigation au clavier complète', async () => {
      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      // Navigation Tab
      emailInput.focus();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();

      // Navigation Shift+Tab
      await user.tab({ shift: true });
      expect(passwordInput).toHaveFocus();

      await user.tab({ shift: true });
      expect(emailInput).toHaveFocus();
    });

    it('devrait avoir des attributs ARIA appropriés', () => {
      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const form = screen.getByRole('form');

      // Assert
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('aria-describedby');

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('aria-describedby');

      expect(form).toHaveAttribute('aria-label', 'Formulaire de connexion');
    });

    it("devrait annoncer les changements d'état aux lecteurs d'écran", async () => {
      // Arrange
      const { loginUser } = await import('../../../core/api');
      vi.mocked(loginUser).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  user: {
                    id: '1',
                    email: 'test@example.com',
                    name: 'Test User',
                    username: 'testuser',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z',
                  },
                  token: 'test',
                }),
              1000
            )
          )
      );

      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/connexion en cours/i)).toBeInTheDocument();
      });

      const statusElement = screen.getByText('submitting-status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Performance et UX', () => {
    it('devrait empêcher les soumissions multiples', async () => {
      // Arrange
      const { loginUser } = await import('../../../core/api');
      vi.mocked(loginUser).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  user: {
                    id: '1',
                    email: 'test@example.com',
                    name: 'Test User',
                    username: 'testuser',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z',
                  },
                  token: 'test',
                }),
              2000
            )
          )
      );

      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Cliquer plusieurs fois rapidement
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledTimes(1);
      });

      expect(submitButton).toBeDisabled();
    });

    it('devrait gérer les timeouts de requête', async () => {
      // Arrange
      const { loginUser } = await import('../../../core/api');
      vi.mocked(loginUser).mockRejectedValue(new Error('Timeout'));

      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/timeout/i)).toBeInTheDocument();
      });
    });
  });

  describe('Gestion des erreurs réseau', () => {
    it('devrait gérer les erreurs 401', async () => {
      // Arrange
      const { loginUser } = await import('../../../core/api');
      const error = new Error('Unauthorized');
      error.name = 'AxiosError';
      (error as unknown as { response: { status: number } }).response = {
        status: 401,
      };
      vi.mocked(loginUser).mockRejectedValue(error);

      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument();
      });
    });

    it('devrait gérer les erreurs 500', async () => {
      // Arrange
      const { loginUser } = await import('../../../core/api');
      const error = new Error('Internal Server Error');
      error.name = 'AxiosError';
      (error as unknown as { response: { status: number } }).response = {
        status: 500,
      };
      vi.mocked(loginUser).mockRejectedValue(error);

      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/erreur serveur/i)).toBeInTheDocument();
      });
    });
  });
});
