import React, { memo } from 'react';
import { env } from '../core/config/env';

interface DevOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant qui n'affiche son contenu qu'en mode développement
 * En production, il n'affiche rien ou le fallback si fourni
 */
export const DevOnly = memo(({ children, fallback = null }: DevOnlyProps) => {
  if (!env.IS_DEV) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
});

/**
 * Hook pour vérifier si on est en mode développement
 */
export const useIsDev = (): boolean => {
  return env.IS_DEV;
};
