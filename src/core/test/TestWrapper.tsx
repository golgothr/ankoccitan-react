import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '../../router';

// Configuration du QueryClient pour les tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Router pour les tests
const createTestRouter = () => {
  return router;
};

// Interface pour les options de test
interface TestWrapperOptions {
  withRouter?: boolean;
  withQueryClient?: boolean;
}

// Composant TestWrapper
interface TestWrapperProps {
  children: React.ReactNode;
  options?: TestWrapperOptions;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children, options = {} }) => {
  const {
    withRouter = false,
    withQueryClient = true,
  } = options;

  // Wrapper avec QueryClient
  const withQueryClientWrapper = (children: React.ReactNode) => {
    if (!withQueryClient) return children;

    const queryClient = createTestQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  // Wrapper avec Router
  const withRouterWrapper = (children: React.ReactNode) => {
    if (!withRouter) return children;

    const router = createTestRouter();
    return <RouterProvider router={router} />;
  };

  return withRouterWrapper(withQueryClientWrapper(children));
};

// Fonction de rendu personnalisée pour les tests
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapperProps?: TestWrapperOptions;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { wrapperProps, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestWrapper options={wrapperProps}>{children}</TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Hooks utilitaires pour les tests
// À implémenter quand les stores seront créés
export const useTestAuth = () => {
  return { isAuthenticated: false, user: null, login: () => {}, logout: () => {} };
};

export const useTestDeck = () => {
  return { decks: [], isLoading: false, fetchDecks: () => {}, createDeck: () => {} };
};

// Mock des APIs pour les tests
export const mockApiResponse = <T,>(data: T, delay = 100) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (error: string, delay = 100) => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(error)), delay);
  });
};

// Utilitaires pour les tests d'intégration
export const waitForLoadingToFinish = async () => {
  // Attendre que tous les loaders disparaissent
  await new Promise((resolve) => setTimeout(resolve, 100));
};

export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};

// Re-exporter les utilitaires de testing-library
export * from '@testing-library/react';
export { customRender as render };
export { TestWrapper };
export type { TestWrapperOptions, CustomRenderOptions }; 