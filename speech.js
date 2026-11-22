import { LANGUAGES } from './translations';

let currentUtterance = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    } catch (e) {
      console.warn('Speech cancellation error:', e);
    }
  }
}

export function isSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

export function speakText(text, langCode = 'en', onStart = null, onEnd = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    if (onEnd) onEnd();
    return false;
  }

  stopSpeaking();

  const langObj = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
  const targetLocale = (langObj.sr || 'en-IN').toLowerCase();
  const prefix = targetLocale.split('-')[0];

  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.rate = 0.92; // Slightly measured pace for low-literacy clarity
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.toLowerCase() === targetLocale)
    || voices.find(v => v.lang.toLowerCase().startsWith(prefix))
    || voices.find(v => v.lang.toLowerCase().includes('in'));

  if (matchedVoice) {
    utterance.voice = matchedVoice;
    utterance.lang = matchedVoice.lang;
  } else {
    utterance.lang = langObj.sr;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech error:', e);
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Failed to trigger speech:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function startListening(langCode, onResult, onError, onEnd) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    if (onError) onError('Voice input is not supported in this browser. Please tap the symptoms on screen.');
    return null;
  }

  const langObj = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
  const recognition = new SpeechRec();
  recognition.lang = langObj.sr || 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    if (onResult) onResult(text);
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (e) {
    if (onError) onError(e.message);
    return null;
  }
}
