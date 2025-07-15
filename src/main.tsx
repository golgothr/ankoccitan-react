import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './AppRouter';
import './index.css';
import './core/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './core/hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
