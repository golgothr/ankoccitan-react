# Guide des Tests - AnkOccitan React

## 🧪 Vue d'ensemble

Ce projet utilise une approche de tests complète avec :
- **Vitest** pour les tests unitaires et d'intégration
- **React Testing Library** pour les tests de composants
- **Cypress** pour les tests E2E
- **TestWrapper personnalisé** pour les tests d'intégration avancés

## 🎯 TestWrapper - Tests d'Intégration Avancés

### Qu'est-ce que le TestWrapper ?

Le `TestWrapper` est un composant personnalisé qui encapsule tous les providers nécessaires pour les tests d'intégration :
- **QueryClient** pour React Query
- **Router** pour TanStack Router
- **Stores Zustand** (à venir)
- **Mocks d'API** automatiques

### Utilisation de base

```typescript
import { render } from '@core/test/TestWrapper';

render(<MonComposant />, {
  wrapperProps: {
    withQueryClient: true,
    withRouter: true,
  },
});
```

### Options disponibles

```typescript
interface TestWrapperOptions {
  withRouter?: boolean;      // Inclure le router
  withQueryClient?: boolean; // Inclure React Query
}
```

### Exemples d'utilisation

#### Test simple avec QueryClient
```typescript
import { render, screen } from '@core/test/TestWrapper';
import { LoginForm } from '@features/auth/components/LoginForm';

describe('LoginForm', () => {
  it('devrait afficher le formulaire', () => {
    render(<LoginForm />, {
      wrapperProps: {
        withQueryClient: true,
      },
    });

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });
});
```

#### Test avec Router
```typescript
import { render, screen } from '@core/test/TestWrapper';
import { ProtectedRoute } from '@features/auth/components/ProtectedRoute';

describe('ProtectedRoute', () => {
  it('devrait rediriger si non authentifié', () => {
    render(<ProtectedRoute />, {
      wrapperProps: {
        withRouter: true,
        withQueryClient: true,
      },
    });

    // Vérifier la redirection
    expect(window.location.pathname).toBe('/login');
  });
});
```

## 🛠️ Utilitaires de Test

### Mocks d'API

```typescript
import { mockApiResponse, mockApiError } from '@core/test/TestWrapper';

// Mock d'une réponse réussie
const mockData = { user: { id: '1', name: 'Test' } };
vi.mocked(apiFunction).mockResolvedValue(mockApiResponse(mockData));

// Mock d'une erreur
vi.mocked(apiFunction).mockRejectedValue(mockApiError('Erreur réseau'));
```

### Utilitaires d'attente

```typescript
import { waitForLoadingToFinish, waitForElementToBeRemoved } from '@core/test/TestWrapper';

// Attendre la fin du chargement
await waitForLoadingToFinish();

// Attendre qu'un élément disparaisse
await waitForElementToBeRemoved(loadingElement);
```

## 📋 Bonnes Pratiques

### 1. Structure des Tests

```typescript
describe('NomDuComposant', () => {
  // Setup global
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Fonctionnalité X', () => {
    it('devrait faire Y quand Z', async () => {
      // Arrange
      const mockData = { /* ... */ };
      vi.mocked(apiFunction).mockResolvedValue(mockData);

      // Act
      render(<Component />, { wrapperProps: { withQueryClient: true } });
      await user.click(button);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Expected')).toBeInTheDocument();
      });
    });
  });
});
```

### 2. Tests d'Accessibilité

```typescript
it('devrait être accessible', () => {
  render(<Component />, { wrapperProps: { withQueryClient: true } });

  // Navigation au clavier
  const element = screen.getByRole('button');
  element.focus();
  expect(element).toHaveFocus();

  // Attributs ARIA
  expect(element).toHaveAttribute('aria-label');
  expect(element).toHaveAttribute('aria-describedby');
});
```

### 3. Tests de Performance

```typescript
it('devrait empêcher les soumissions multiples', async () => {
  const slowApi = vi.fn().mockImplementation(() => 
    new Promise(resolve => setTimeout(resolve, 1000))
  );

  render(<Form />, { wrapperProps: { withQueryClient: true } });

  const submitButton = screen.getByRole('button');
  
  // Cliquer plusieurs fois
  await user.click(submitButton);
  await user.click(submitButton);
  await user.click(submitButton);

  // Vérifier qu'une seule requête a été envoyée
  expect(slowApi).toHaveBeenCalledTimes(1);
  expect(submitButton).toBeDisabled();
});
```

### 4. Tests d'Erreurs

```typescript
it('devrait gérer les erreurs réseau', async () => {
  vi.mocked(apiFunction).mockRejectedValue(new Error('Network Error'));

  render(<Component />, { wrapperProps: { withQueryClient: true } });

  await user.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/erreur réseau/i)).toBeInTheDocument();
  });
});
```

## 🔧 Configuration

### Setup des Tests

Le fichier `src/core/test/setup.ts` configure l'environnement de test :

```typescript
// Mocks globaux
vi.mock('import.meta.env', () => ({
  VITE_API_URL: 'http://localhost:3000/api',
}));

// Mock de localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
} as Storage;
```

### Configuration Vitest

```typescript
// vite.config.ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/core/test/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html', 'lcov'],
  },
}
```

## 🎨 Tests Visuels avec Storybook

### Stories de Test

```typescript
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';

const meta: Meta<typeof Component> = {
  title: 'Features/Auth/Component',
  component: Component,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props par défaut
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
```

### Tests d'Interaction

```typescript
// Component.stories.test.ts
import { expect, test } from '@storybook/test-runner';

test('interaction test', async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  const button = canvas.getByRole('button');
  await userEvent.click(button);
  
  await expect(canvas.getByText('Clicked!')).toBeInTheDocument();
});
```

## 🚀 Tests E2E avec Cypress

### Configuration

```typescript
// cypress/e2e/auth.cy.ts
describe('Authentification', () => {
  it('devrait permettre la connexion', () => {
    cy.visit('/login');
    
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-name"]').should('contain', 'Test User');
  });
});
```

### Bonnes Pratiques Cypress

1. **Utiliser des data-testid** pour les sélecteurs
2. **Attendre les requêtes réseau** avec `cy.intercept()`
3. **Nettoyer l'état** entre les tests
4. **Tester les cas d'erreur**

## 📊 Couverture de Code

### Génération des Rapports

```bash
npm run test:coverage
```

### Seuils de Couverture

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Exclusions

```typescript
// vite.config.ts
coverage: {
  exclude: [
    'node_modules/',
    'src/core/test/',
    '**/*.stories.*',
    '**/*.test.*',
  ],
}
```

## 🔍 Debugging des Tests

### Mode Debug

```bash
npm run test:ui
```

### Logs Détaillés

```typescript
// Dans les tests
console.log('Debug info:', element.textContent);
screen.debug(); // Afficher le DOM
```

### Tests Isolés

```typescript
it.only('test spécifique', () => {
  // Ce test seul sera exécuté
});

it.skip('test ignoré', () => {
  // Ce test sera ignoré
});
```

## 📚 Ressources

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)
- [Cypress](https://docs.cypress.io/)
- [Storybook Testing](https://storybook.js.org/docs/writing-tests/introduction)

---

**Tests maintenus avec ❤️ pour la qualité du code** 