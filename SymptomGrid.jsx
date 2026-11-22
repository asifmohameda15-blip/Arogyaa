import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import AudioSpeakerButton from './AudioSpeakerButton';

export default function SymptomGrid({ conditions, onSelectCondition, onOpenEmergency }) {
  const { language, t } = useLanguage();

  return (
    <div className="symptom-section">
      <div className="section-header-row">
        <div>
          <h2 className="section-heading flex items-center gap-2">
            <span>🩺</span>
            <span>{t.quickSymptomsTitle}</span>
          </h2>
          <p className="section-subheading">
            Tap any picture or listen to find instant safe home remedies
          </p>
        </div>
        <AudioSpeakerButton
          text={`${t.quickSymptomsTitle}. Tap any symptom icon below to hear remedies.`}
          label="Listen All"
          size="sm"
        />
      </div>

      <div className="symptom-cards-grid">
        {conditions.map((item) => {
          const name = item.n ? (item.n[language] || item.n.en) : item.name;
          const desc = item.shortDesc ? (item.shortDesc[language] || item.shortDesc.en) : (item.shortDesc || '');

          return (
            <div
              key={item.id}
              onClick={() => onSelectCondition(item.id)}
              className="symptom-card-item cursor-pointer"
            >
              <div className="symptom-icon-box">
                <span className="symptom-large-emoji">{item.ic || item.icon}</span>
              </div>
              <div className="symptom-card-content">
                <h3 className="symptom-card-name">{name}</h3>
                <p className="symptom-card-desc">{desc}</p>
              </div>
              <div className="symptom-card-actions">
                <AudioSpeakerButton
                  text={`${name}. ${desc}`}
                  label="Audio"
                  size="sm"
                />
                <button className="tap-view-btn">
                  Tap for Advice ➔
                </button>
              </div>
            </div>
          );
        })}

        {/* Big Emergency SOS Card */}
        <div
          onClick={onOpenEmergency}
          className="symptom-card-item emergency-card-item cursor-pointer"
        >
          <div className="symptom-icon-box emergency-icon-box">
            <span className="symptom-large-emoji animate-pulse">🚨</span>
          </div>
          <div className="symptom-card-content">
            <h3 className="symptom-card-name text-red-700">
              {t.emergencyBtn}
            </h3>
            <p className="symptom-card-desc">
              Heart attack, chest pain, snake bite, unconsciousness, heavy bleeding
            </p>
          </div>
          <div className="symptom-card-actions">
            <span className="emergency-call-badge">
              Direct Dial 108 📞
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
