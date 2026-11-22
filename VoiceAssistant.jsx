import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { startListening } from '../utils/speech';

export default function VoiceAssistant({ onSearch, isSearching }) {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [voiceError, setVoiceError] = useState(null);

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setVoiceError(null);
    setIsListening(true);
    setTranscript('');

    const rec = startListening(
      language,
      (text) => {
        setTranscript(text);
        setInputText(text);
        setIsListening(false);
        onSearch(text);
      },
      (error) => {
        setVoiceError('Voice input error. You can tap the symptom cards below.');
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!rec) {
      setIsListening(false);
      setVoiceError('Speech recognition is not supported in this browser. Please tap the symptoms below.');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSearch(inputText);
  };

  return (
    <div className="voice-assistant-card">
      <div className="voice-top-panel">
        <div className="flex items-center gap-2">
          <span className="live-pulse-dot"></span>
          <span className="font-bold text-emerald-900 tracking-wide uppercase text-xs">
            {isListening ? t.speaking : 'Voice-Guided AI Triage'}
          </span>
        </div>
        <p className="voice-instruction-sub">
          {t.audioInstructions}
        </p>
      </div>

      {/* Main Microphone Button */}
      <div className="mic-container">
        <button
          onClick={toggleMic}
          className={`mic-super-button ${isListening ? 'mic-active-pulse' : 'mic-idle'}`}
          aria-label={t.speak}
          title={isListening ? 'Listening…' : 'Tap to speak'}
        >
          <span className="mic-icon-large">
            {isListening ? '🎙️' : '🎤'}
          </span>
          <span className="mic-label-text">
            {isListening ? t.speaking : t.speak}
          </span>
        </button>
      </div>

      {/* Live Transcript / Feedback */}
      {transcript && (
        <div className="transcript-bubble">
          <span className="font-semibold text-gray-500 mr-2">You said:</span>
          <span className="text-emerald-950 font-bold">"{transcript}"</span>
        </div>
      )}

      {voiceError && (
        <div className="voice-error-banner">
          <span>⚠️ {voiceError}</span>
        </div>
      )}

      {/* Quick Voice Prompt Shortcuts */}
      <div className="quick-prompts-row">
        <span className="text-xs font-bold text-gray-500 uppercase">Say or Tap:</span>
        <button
          onClick={() => onSearch('Fever temperature')}
          className="prompt-chip"
        >
          🤒 Fever
        </button>
        <button
          onClick={() => onSearch('Cold cough throat')}
          className="prompt-chip"
        >
          🤧 Cough / Cold
        </button>
        <button
          onClick={() => onSearch('Stomach loose motion vomit')}
          className="prompt-chip"
        >
          🤢 Stomach Ache
        </button>
        <button
          onClick={() => onSearch('Headache head pain')}
          className="prompt-chip"
        >
          🤕 Headache
        </button>
        <button
          onClick={() => onSearch('Skin rash wound burn')}
          className="prompt-chip"
        >
          🩹 Skin Cut / Burn
        </button>
        <button
          onClick={() => onSearch('Chest pain')}
          className="prompt-chip prompt-chip-emergency"
        >
          🚨 Chest Pain (108)
        </button>
      </div>

      {/* Manual Input Bar */}
      <form onSubmit={handleManualSubmit} className="search-bar-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="search-input"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isSearching || !inputText.trim()}
          className="search-submit-btn"
        >
          {isSearching ? '…' : t.send}
        </button>
      </form>
    </div>
  );
}
