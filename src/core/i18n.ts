// Basic i18n implementation used across the application.
// This small helper loads the translation files and exposes a minimal
// API compatible with the existing components.

import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';
import oc from '../../public/locales/oc/translation.json';

type Language = 'fr' | 'en' | 'oc';
type Translations = Record<string, string>;

const resources: Record<Language, Translations> = {
  fr,
  en,
  oc,
};

export const i18n = {
  language: 'fr' as Language,
  t: (key: string, _options?: Record<string, unknown>) => {
    const dict = resources[i18n.language] ?? {};
    return dict[key] ?? key;
  },
  changeLanguage: (lng: Language) => {
    i18n.language = lng;
    if (process.env.NODE_ENV === 'development') {
      console.log('Language changed to:', lng);
    }
  },
};

export default i18n;
