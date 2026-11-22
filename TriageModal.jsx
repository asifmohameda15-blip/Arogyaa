import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AudioSpeakerButton from './AudioSpeakerButton';

export default function TriageModal({ triageResult, onClose, onOpenEmergency, onGoToWorkers }) {
  const { language, t, speak } = useLanguage();
  const { isAuthenticated } = useAuth();

  if (!triageResult) return null;

  const { condition, isEmergency } = triageResult;

  // Auto-speak condition name upon opening to aid illiterate users
  useEffect(() => {
    if (condition && condition.name) {
      speak(`${condition.name}. ${condition.shortDesc || ''}`);
    }
  }, [condition]);

  const tips = condition?.tips || [];
  const seeDoctor = condition?.seeDoctor || [];
  const fullNarration = condition?.audioNarration ||
    `${condition?.name}. ${t.whatYouCanDo} ${tips.join('. ')}. ${t.seeDoctorIf} ${seeDoctor.join('. ')}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="triage-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="modal-top-bar">
          <div className="flex items-center gap-3">
            <span className="modal-symptom-icon">{condition?.icon || '🩺'}</span>
            <div>
              <h2 className="modal-condition-title">{condition?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`risk-badge ${
                  condition?.severity === 'mild' ? 'risk-mild' : 'risk-moderate'
                }`}>
                  {condition?.severity === 'mild' ? t.riskMild : t.riskModerate}
                </span>
                <span className="text-xs text-gray-500">{condition?.shortDesc}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Master Voice Readout Control for Illiterate Users */}
        <div className="audio-hero-strip">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗣️</span>
            <div>
              <p className="font-bold text-emerald-950 text-sm">
                Voice Guidance (வழிகாட்டல் / मार्गदर्शन)
              </p>
              <p className="text-xs text-emerald-800">
                Tap the button to listen to the whole advice out loud in your language
              </p>
            </div>
          </div>
          <AudioSpeakerButton
            text={fullNarration}
            label={t.listenAdvice}
            size="lg"
            className="pulse-glow"
          />
        </div>

        <div className="modal-scroll-body">
          {/* Section 1: Home Care Remedies (Green) */}
          <div className="triage-section home-care-section">
            <div className="section-title-wrap">
              <span className="section-pill green-pill">🟢 {t.whatYouCanDo}</span>
              <AudioSpeakerButton
                text={`${t.whatYouCanDo}. ${tips.join('. ')}`}
                label="Listen Remedies"
                size="sm"
              />
            </div>
            <ul className="remedy-list">
              {tips.map((tip, idx) => (
                <li key={idx} className="remedy-item">
                  <span className="check-bullet">✓</span>
                  <span className="remedy-text">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Red-Flag Warnings / See a Doctor (Yellow / Red) */}
          <div className="triage-section red-flag-section">
            <div className="section-title-wrap">
              <span className="section-pill yellow-pill">⚠️ {t.seeDoctorIf}</span>
              <AudioSpeakerButton
                text={`${t.seeDoctorIf}. ${seeDoctor.join('. ')}`}
                label="Listen Warnings"
                size="sm"
              />
            </div>
            <ul className="warning-list">
              {seeDoctor.map((item, idx) => (
                <li key={idx} className="warning-item">
                  <span className="warning-bullet">!</span>
                  <span className="warning-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div className="disclaimer-box">
            <span className="text-sm">ℹ️</span>
            <p className="text-xs text-gray-600">{t.disclaimer}</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="modal-bottom-bar">
          <button
            onClick={() => {
              onClose();
              onGoToWorkers();
            }}
            className="btn-worker-connect"
          >
            <span className="text-lg">👩‍⚕️</span>
            <span>Contact Health Worker</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenEmergency();
            }}
            className="btn-emergency-trigger"
          >
            <span>🚨 108 Emergency</span>
          </button>
        </div>
      </div>
    </div>
  );
}
