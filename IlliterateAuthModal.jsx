import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AudioSpeakerButton from './AudioSpeakerButton';

const AVATARS = [
  { id: 'grandma', emoji: '👵', label: 'Grandmother' },
  { id: 'grandpa', emoji: '👴', label: 'Grandfather' },
  { id: 'father', emoji: '👨', label: 'Father' },
  { id: 'mother', emoji: '👩', label: 'Mother' },
  { id: 'boy', emoji: '👦', label: 'Boy' },
  { id: 'girl', emoji: '👧', label: 'Girl' },
  { id: 'sister', emoji: '🧕', label: 'Sister' },
  { id: 'elder', emoji: '🧑', label: 'Elder' }
];

export default function IlliterateAuthModal({ isOpen, onClose }) {
  const { language, t, speak } = useLanguage();
  const { login, register, quickDemoLogin } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [selectedAvatar, setSelectedAvatar] = useState('👵');
  const [phone, setPhone] = useState('9876543210');
  const [name, setName] = useState('Kamala Amma');
  const [pin, setPin] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('9840012345');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleKeypadPress = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      speak(digit.toString());
    }
  };

  const handleKeypadBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClearPin = () => {
    setPin('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!phone || pin.length < 4) {
      setErrorMessage('Please enter a 10-digit mobile number and 4-digit PIN');
      speak('Please enter your phone number and 4-digit PIN');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'login') {
        await login(phone, pin);
        speak(`Welcome back! You are logged in.`);
        onClose();
      } else {
        await register({
          phone,
          pin,
          name,
          avatar: selectedAvatar,
          language,
          emergencyContact: emergencyPhone
        });
        speak(`Profile created! Welcome ${name}.`);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error');
      speak(err.message || 'Incorrect information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await quickDemoLogin(language);
      speak('Welcome! Demo patient account connected.');
      onClose();
    } catch (err) {
      setErrorMessage('Could not load demo account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="modal-top-bar">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <div>
              <h2 className="modal-condition-title">
                {mode === 'login' ? t.login : 'Create Patient Profile'}
              </h2>
              <p className="text-xs text-emerald-800">
                Simple visual sign-in for everyone
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            ✕
          </button>
        </div>

        {/* Audio Guide for Illiterate Users */}
        <div className="audio-hero-strip">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗣️</span>
            <span className="text-xs font-semibold text-emerald-950">
              Listen to sign-in instructions:
            </span>
          </div>
          <AudioSpeakerButton
            text="Please select your picture and enter your 4 digit secret PIN code using the large number buttons below, or tap the instant demo button."
            label="🔊 Audio Instructions"
            size="sm"
          />
        </div>

        {/* Instant 1-Tap Demo Access */}
        <div className="quick-demo-box my-3">
          <button
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="quick-demo-btn pulse-glow"
          >
            <span className="text-2xl">👵</span>
            <div className="text-left">
              <span className="text-xs uppercase font-extrabold block text-amber-900">
                Fastest for Illiterate / Testing
              </span>
              <span className="text-base font-bold block text-emerald-950">
                1-Tap Patient Access (Kamala Amma)
              </span>
            </div>
            <span className="text-lg">➔</span>
          </button>
        </div>

        <div className="divider-line my-3">
          <span>OR SIGN IN WITH PIN</span>
        </div>

        {/* Mode Toggle */}
        <div className="auth-tab-switch">
          <button
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMessage(''); }}
          >
            {t.login}
          </button>
          <button
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErrorMessage(''); }}
          >
            New Patient Profile
          </button>
        </div>

        {errorMessage && (
          <div className="error-alert-banner">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Avatar Selection (if registering) */}
        {mode === 'register' && (
          <div className="avatar-selection-section my-3">
            <label className="text-xs font-bold text-gray-700 block mb-1">
              {t.chooseAvatar}
            </label>
            <div className="avatar-grid">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(av.emoji);
                    speak(av.label);
                  }}
                  className={`avatar-choice-btn ${
                    selectedAvatar === av.emoji ? 'avatar-chosen' : ''
                  }`}
                  title={av.label}
                >
                  <span className="text-3xl">{av.emoji}</span>
                  <span className="text-[10px] block font-medium mt-0.5">{av.label}</span>
                </button>
              ))}
            </div>

            <div className="my-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Patient Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Patient Name"
                className="modal-text-input"
              />
            </div>
          </div>
        )}

        {/* Phone Input */}
        <div className="input-group-row mb-3">
          <label className="text-xs font-bold text-gray-700 block mb-1">
            📱 {t.phonePrompt}:
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            className="modal-text-input font-mono text-lg font-bold"
          />
        </div>

        {/* 4-Digit Secret PIN Display */}
        <div className="pin-entry-container">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-gray-700">
              🔑 {t.pinPrompt}:
            </label>
            <span className="text-xs text-gray-500 font-semibold">{pin.length} / 4 digits</span>
          </div>

          <div className="pin-dots-row">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`pin-dot ${idx < pin.length ? 'pin-dot-filled' : ''}`}
              >
                {idx < pin.length ? '●' : '○'}
              </div>
            ))}
          </div>

          {/* Large On-Screen Number Keypad for Illiterate Ease */}
          <div className="keypad-grid my-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="keypad-btn"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearPin}
              className="keypad-btn keypad-func text-xs"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress(0)}
              className="keypad-btn"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="keypad-btn keypad-func text-lg"
            >
              ⌫
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || pin.length < 4}
          className="auth-submit-btn w-full mt-3"
        >
          {isLoading ? 'Processing…' : mode === 'login' ? `Sign In ➔` : `${t.createAccount} ➔`}
        </button>
      </div>
    </div>
  );
}
