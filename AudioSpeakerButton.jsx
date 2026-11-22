import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { speakText, stopSpeaking } from '../utils/speech';

export default function AudioSpeakerButton({ text, label = 'Listen', size = 'md', className = '' }) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speakText(
      text,
      language,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <button
      onClick={handleClick}
      aria-label="Listen to audio advice"
      className={`audio-btn inline-flex items-center gap-2 font-semibold transition-all rounded-full ${
        isPlaying ? 'bg-amber-500 text-white ring-4 ring-amber-200' : 'bg-emerald-700 text-white hover:bg-emerald-800'
      } ${
        isSmall ? 'px-3 py-1 text-xs' : isLarge ? 'px-5 py-3 text-lg shadow-md' : 'px-4 py-2 text-sm'
      } ${className}`}
      title={isPlaying ? 'Stop voice' : 'Listen with voice'}
    >
      <span className={`speaker-icon ${isPlaying ? 'animate-bounce' : ''}`}>
        {isPlaying ? '⏹️' : '🔊'}
      </span>
      <span>{isPlaying ? 'Stop' : label}</span>
      {isPlaying && (
        <span className="sound-wave flex gap-0.5 items-center">
          <span className="wave-bar"></span>
          <span className="wave-bar wave-delay-1"></span>
          <span className="wave-bar wave-delay-2"></span>
        </span>
      )}
    </button>
  );
}
