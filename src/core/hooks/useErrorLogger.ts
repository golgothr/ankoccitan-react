import { useCallback } from 'react';
import { Sentry } from '@/core/utils/sentry';

export function useErrorLogger() {
  return useCallback((error: unknown) => {
    Sentry.captureException(error);
    if (import.meta.env.DEV) {
      console.error(error);
    }
  }, []);
}
