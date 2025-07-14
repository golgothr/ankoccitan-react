import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

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

interface TestWrapperOptions {
  withRouter?: boolean;
  withQueryClient?: boolean;
}

interface TestWrapperProps {
  children: React.ReactNode;
  options?: TestWrapperOptions;
}

const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  options = {},
}) => {
  const { withRouter = false, withQueryClient = true } = options;

  // Wrapper avec QueryClient
  const withQueryClientWrapper = (children: React.ReactNode) => {
    if (!withQueryClient) return children;

    const queryClient = createTestQueryClient();
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  // Wrapper avec Router
  const withRouterWrapper = (children: React.ReactNode) => {
    if (!withRouter) return children;

    return <BrowserRouter>{children}</BrowserRouter>;
  };

  return withRouterWrapper(withQueryClientWrapper(children));
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

// Export des fonctions de test avec le wrapper
export { render, screen, fireEvent, waitFor } from '@testing-library/react';
export { TestWrapper };
