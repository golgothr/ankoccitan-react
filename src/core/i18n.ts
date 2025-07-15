import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { env } from './config/env';
import { useAppStore } from './store/useAppStore';

// Config initiale
void i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    lng: useAppStore.getState().language,
    debug: env.IS_DEV,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

i18n.on('languageChanged', (lng) => {
  useAppStore.getState().setLanguage(lng);
});

export default i18n;
