import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { deCommonMessages, deMessages, enCommonMessages, enMessages } from '@axonivy/form-editor';

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      debug: false,
      supportedLngs: ['en', 'de'],
      fallbackLng: 'en',
      ns: ['form-editor'],
      defaultNS: 'form-editor',
      resources: {
        en: { 'form-editor': enMessages, common: enCommonMessages },
        de: { 'form-editor': deMessages, common: deCommonMessages }
      }
    });
};
