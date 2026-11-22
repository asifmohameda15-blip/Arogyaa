import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, UI_TEXT } from '../utils/translations';
import { speakText, stopSpeaking } from '../utils/speech';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('arogyaa_lang') || 'en';
  });

  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    localStorage.setItem('arogyaa_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (code) => {
    stopSpeaking();
    setLanguage(code);
    // Announce language change to aid illiterate user
    const welcome = UI_TEXT[code]?.audioInstructions || UI_TEXT.en.audioInstructions;
    speakText(welcome, code, () => setIsVoiceActive(true), () => setIsVoiceActive(false));
  };

  const t = UI_TEXT[language] || UI_TEXT.en;
  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const speak = (text) => {
    return speakText(text, language, () => setIsVoiceActive(true), () => setIsVoiceActive(false));
  };

  const stopAudio = () => {
    stopSpeaking();
    setIsVoiceActive(false);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      t,
      currentLangObj,
      languages: LANGUAGES,
      isVoiceActive,
      speak,
      stopAudio
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
