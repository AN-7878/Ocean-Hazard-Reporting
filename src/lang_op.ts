import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en_translation.json";
import hi from "./locales/hin_translation.json";
import mr from "./locales/mara_translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr }
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
