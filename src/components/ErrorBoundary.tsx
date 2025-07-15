import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import * as Sentry from '@sentry/react';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="error-fallback p-4 text-red-600">
      <h2>Oops! Une erreur est survenue</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Réessayer</button>
    </div>
  );
}

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      Sentry.captureException(error, { extra: errorInfo });
    }}
  >
    {children}
  </ReactErrorBoundary>
);
