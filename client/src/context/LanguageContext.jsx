import { createContext, useContext, useMemo, useState } from 'react';

const translations = {
  en: { home: 'Home', browse: 'Browse equipment', myEquipment: 'My equipment', myRentals: 'My rentals', profile: 'Profile', login: 'Log in', logout: 'Log out', createAccount: 'Create account', language: 'Language' },
  mr: { home: 'मुख्यपृष्ठ', browse: 'उपकरणे पहा', myEquipment: 'माझी उपकरणे', myRentals: 'माझे भाडे', profile: 'प्रोफाइल', login: 'लॉग इन', logout: 'लॉग आउट', createAccount: 'खाते तयार करा', language: 'भाषा' },
};
const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('agriconnect-language') || 'mr');
  const setLanguage = (next) => { setLanguageState(next); localStorage.setItem('agriconnect-language', next); };
  const value = useMemo(() => ({ language, setLanguage, t: (key) => translations[language][key] || translations.en[key] || key }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
