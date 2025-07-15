// Configuration i18n simplifiée
// Pour l'instant, on utilise une configuration basique
// Les traductions peuvent être ajoutées plus tard

export const i18n = {
  t: (key: string, _options?: Record<string, unknown>) => {
    // Retourne la clé par défaut, à remplacer par de vraies traductions
    return key;
  },
  changeLanguage: (lng: string) => {
    // Log le changement de langue en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('Language changed to:', lng);
    }
  },
  language: 'fr',
};

export default i18n;
