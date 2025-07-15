import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../core/test/TestWrapper';
import { LoginForm } from '../components/LoginForm';
import { mockApiResponse, mockApiError } from '../../../core/test/TestWrapper';

// Mock des APIs
vi.mock('../../../core/api', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

describe("AuthFlow - Tests d'intégration", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Flux de connexion', () => {
    it('devrait permettre à un utilisateur de se connecter avec succès', async () => {
      // Arrange
      const mockLoginResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
        token: 'mock-jwt-token',
      };

      const { loginUser } = await import('../../../core/api');
      vi.mocked(loginUser).mockResolvedValue(
        mockApiResponse(mockLoginResponse)
      );

      // Act
      render(<LoginForm />, {
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
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Vérifier que l'utilisateur est redirigé ou que le message de succès s'affiche
      await waitFor(() => {
        expect(screen.getByText(/connexion réussie/i)).toBeInTheDocument();
      });
    });

    it("devrait afficher une erreur en cas d'échec de connexion", async () => {
      // Arrange
      const { loginUser } = await import('../../../core/api');
      vi.mocked(loginUser).mockRejectedValue(
        mockApiError('Identifiants invalides')
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

      await user.type(emailInput, 'invalid@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument();
      });
    });

    it('devrait valider les champs du formulaire', async () => {
      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      // Essayer de soumettre sans remplir les champs
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
        expect(
          screen.getByText(/le mot de passe est requis/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Validation des champs', () => {
    it("devrait valider le format de l'email", async () => {
      // Act
      render(<LoginForm />, {
        wrapperProps: {
          withQueryClient: true,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /se connecter/i,
      });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/format d'email invalide/i)
        ).toBeInTheDocument();
      });
    });

    it('devrait valider la longueur du mot de passe', async () => {
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
      await user.type(passwordInput, '123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(
            /le mot de passe doit contenir au moins 6 caractères/i
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir une navigation au clavier fonctionnelle', async () => {
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

      // Navigation au clavier
      emailInput.focus();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
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

      // Assert
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
    });
  });

  describe('Performance', () => {
    it('devrait gérer les soumissions multiples', async () => {
      // Arrange
      const { loginUser } = await import('../../../core/api');
      vi.mocked(loginUser).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ user: null, token: 'test' }), 1000)
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
        expect(loginUser).toHaveBeenCalledTimes(1); // Une seule fois malgré les clics multiples
      });
    });
  });
});
