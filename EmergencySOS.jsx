import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AudioSpeakerButton from './AudioSpeakerButton';

export default function EmergencySOS({ isOpen, onClose, queryText }) {
  const { language, t, speak } = useLanguage();
  const { user } = useAuth();
  const [isAlertLogged, setIsAlertLogged] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const emergencyAudio = {
        en: "Emergency! Call 108 or go to the nearest hospital right now. Keep the patient calm and lying down.",
        ta: "அவசரம்! உடனே 108 ஐ அழையுங்கள் அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்லுங்கள்.",
        hi: "इमरजेंसी! अभी 108 पर कॉल करें या नज़दीकी अस्पताल जाएं।",
        ml: "അടിയന്തരാവസ്ഥ! ഉടൻ 108-ൽ വിളിക്കുകയോ അടുത്തുള്ള ആശുപത്രിയിലേക്ക് പോകുകയോ ചെയ്യുക.",
        te: "అత్యవసరం! వెంటనే 108కు కాల్ చేయండి లేదా దగ్గరలోని ఆసుపత్రికి వెళ్లండి.",
        kn: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ! ತಕ್ಷಣ 108ಕ್ಕೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ."
      }[language] || "Emergency! Call 108 right now.";

      speak(emergencyAudio);

      // Log alert to backend
      fetch('/api/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: queryText || 'Direct SOS Button Pressed',
          userPhone: user ? user.phone : 'Not provided'
        })
      })
      .then(res => res.json())
      .then(data => setIsAlertLogged(true))
      .catch(err => console.error('SOS dispatch error:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop emergency-backdrop" onClick={onClose}>
      <div className="emergency-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="emergency-siren-box animate-pulse">
          <span className="text-6xl">🚨</span>
        </div>

        <h2 className="emergency-headline">{t.emergencyModalTitle}</h2>
        <p className="emergency-notice-text">{t.emergencyNotice}</p>

        {/* Audio Speaker */}
        <div className="flex justify-center my-3">
          <AudioSpeakerButton
            text={`${t.emergencyModalTitle}. ${t.emergencyNotice}. Ambulance 108 is available 24/7.`}
            label="🔊 Listen to Emergency Instructions"
            size="lg"
            className="emergency-audio-btn"
          />
        </div>

        {/* 1-Tap Call 108 Button */}
        <div className="emergency-call-wrap my-4">
          <a
            href="tel:108"
            className="call-108-large-btn"
          >
            <span className="text-3xl">📞</span>
            <div className="text-left">
              <span className="text-xs uppercase font-extrabold tracking-wider block">Tap to Direct Call</span>
              <span className="text-2xl font-black block">CALL 108 AMBULANCE</span>
            </div>
          </a>
        </div>

        {/* First Aid While Waiting */}
        <div className="first-aid-box">
          <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
            <span>🛡️</span>
            <span>While waiting for the ambulance:</span>
          </h4>
          <ul className="text-left text-sm text-red-950 space-y-1.5 pl-2">
            <li>• Keep patient calm and resting in a comfortable position.</li>
            <li>• Ensure patient's breathing airway is completely clear.</li>
            <li>• For chest pain: Loosen tight clothing around chest and neck.</li>
            <li>• For snake bites: Keep bitten limb completely still below heart level.</li>
            <li>• For heavy bleeding: Press a clean thick cloth firmly over the wound.</li>
            <li>• Do NOT give food, milk, or pills if patient is drowsy.</li>
          </ul>
        </div>

        {isAlertLogged && (
          <div className="sos-dispatched-tag">
            ✓ SOS Alert Timestamp logged to health response database
          </div>
        )}

        <button
          onClick={onClose}
          className="emergency-dismiss-btn"
        >
          Close & Return to Triage
        </button>
      </div>
    </div>
  );
}
