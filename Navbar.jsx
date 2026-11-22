import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AudioSpeakerButton from './AudioSpeakerButton';

export default function Navbar({ onOpenAuth, onOpenEmergency, onToggleHealthLog, activeTab, setActiveTab }) {
  const { language, setLanguage, languages, t, currentLangObj } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header-nav">
      <div className="nav-container">
        {/* Logo and Motto */}
        <div className="brand-group">
          <div className="logo-box" onClick={() => setActiveTab('triage')}>
            <span className="logo-icon">🩺</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="logo-title">{t.appTitle}</h1>
                <span className="badge-pill">Med-Tech</span>
              </div>
              <p className="logo-sub">{t.tagline}</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Audio intro for illiterate users */}
          <AudioSpeakerButton
            text={`${t.appTitle}. ${t.tagline}. ${t.motto}. ${t.audioInstructions}`}
            label="🔊 Audio Help"
            size="sm"
            className="hidden-mobile"
          />

          {/* Emergency 108 SOS */}
          <button
            onClick={onOpenEmergency}
            className="sos-btn pulse-glow"
            aria-label="Emergency 108 Call"
          >
            <span className="text-xl">🚨</span>
            <span className="font-extrabold tracking-wide">108 SOS</span>
          </button>

          {/* Language Selector */}
          <div className="lang-picker">
            <span className="lang-flag">{currentLangObj.flag}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
              aria-label="Select Language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* User Auth Profile Button */}
          {isAuthenticated ? (
            <div className="user-profile-badge">
              <span className="user-avatar-circle" title={user.name}>
                {user.avatar || '👨'}
              </span>
              <div className="user-info-text hidden-mobile">
                <span className="user-name">{user.name}</span>
                <span className="user-role">Patient Profile</span>
              </div>
              <button
                onClick={logout}
                className="logout-mini-btn"
                title={t.logout}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="login-trigger-btn"
            >
              <span className="text-lg">👤</span>
              <span>{t.login}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs for Easy Illiterate Switching */}
      <div className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'triage' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('triage')}
        >
          <span className="tab-icon">🏠</span>
          <span>{t.quickSymptomsTitle}</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'bodymap' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('bodymap')}
        >
          <span className="tab-icon">🧍</span>
          <span>{t.bodyMapTitle}</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'workers' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('workers')}
        >
          <span className="tab-icon">👩‍⚕️</span>
          <span>{t.healthWorkers}</span>
        </button>
        {isAuthenticated && (
          <button
            className={`tab-item ${activeTab === 'history' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-icon">📋</span>
            <span>{t.myHealthLog}</span>
          </button>
        )}
      </div>
    </header>
  );
}
