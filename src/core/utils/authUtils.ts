/**
 * Utilitaires pour la gestion de l'authentification
 */

/**
 * Nettoie complètement l'état d'authentification
 */
export const clearAuthState = () => {
  // Nettoyer le localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('ankoccitan-auth');

  // Nettoyer les cookies de session
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });

  // Forcer la redirection
  window.location.href = '/';
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('auth_token');
    const supabaseAuth = localStorage.getItem('ankoccitan-auth');
    return !!(token || supabaseAuth);
  } catch {
    return false;
  }
};

/**
 * Déconnecte l'utilisateur de manière forcée
 */
export const forceLogout = () => {
  console.log('[authUtils] Déconnexion forcée');
  clearAuthState();
};
