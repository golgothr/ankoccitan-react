/**
 * Configuration centralisée des variables d'environnement
 * Ce module valide toutes les variables requises au démarrage de l'application
 */

interface EnvironmentConfig {
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;

  // API
  API_URL: string;

  // Mode de développement
  NODE_ENV: 'development' | 'production' | 'test';
  IS_DEV: boolean;
  IS_PROD: boolean;
  IS_TEST: boolean;
}

/**
 * Valide et retourne la configuration des variables d'environnement
 */
function validateEnvironment(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    // Supabase - Variables obligatoires
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,

    // API - Variable optionnelle avec valeur par défaut
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

    // Mode de développement
    NODE_ENV: (import.meta.env.MODE ||
      'development') as EnvironmentConfig['NODE_ENV'],
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
    IS_TEST: import.meta.env.MODE === 'test',
  };

  // Validation des variables obligatoires
  const missingVars: string[] = [];

  if (!config.SUPABASE_URL) {
    missingVars.push('VITE_SUPABASE_URL');
  }

  if (!config.SUPABASE_ANON_KEY) {
    missingVars.push('VITE_SUPABASE_ANON_KEY');
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes : ${missingVars.join(', ')}\n` +
        'Veuillez créer un fichier .env à la racine du projet avec ces variables.'
    );
  }

  // Validation du format des URLs Supabase
  try {
    new URL(config.SUPABASE_URL);
  } catch {
    throw new Error('VITE_SUPABASE_URL doit être une URL valide');
  }

  return config;
}

/**
 * Configuration validée des variables d'environnement
 * Cette variable est initialisée au chargement du module
 */
export const env = validateEnvironment();

/**
 * Fonction utilitaire pour vérifier si une variable d'environnement est définie
 */
export function hasEnvVar(key: string): boolean {
  return !!import.meta.env[key];
}

/**
 * Fonction utilitaire pour obtenir une variable d'environnement avec fallback
 */
export function getEnvVar(key: string, fallback?: string): string | undefined {
  return import.meta.env[key] || fallback;
}

/**
 * Fonction utilitaire pour obtenir une variable d'environnement obligatoire
 */
export function getRequiredEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Variable d'environnement requise manquante : ${key}`);
  }
  return value;
}

// Export des types pour utilisation dans d'autres modules
export type { EnvironmentConfig };
