import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AudioSpeakerButton from './AudioSpeakerButton';

export default function ConsultationHistory({ onSelectCondition }) {
  const { language, t, speak } = useLanguage();
  const { user, token, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/triage/history', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setHistory(data.data);
        }
      })
      .catch(err => console.error('Error fetching history:', err))
      .finally(() => setLoading(false));
  }, [token]);

  if (!isAuthenticated) {
    return (
      <div className="empty-state-box">
        <span className="text-4xl mb-2">🔒</span>
        <h3 className="font-bold text-gray-800 text-lg">Patient Log Requires Sign In</h3>
        <p className="text-sm text-gray-600 max-w-sm mt-1">
          Sign in or tap the 1-Tap Patient Access above to save and view your consultations.
        </p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="section-header-row mb-4">
        <div>
          <h2 className="section-heading flex items-center gap-2">
            <span>📋</span>
            <span>{t.myHealthLog}</span>
          </h2>
          <p className="section-subheading">
            {user?.name}'s saved checkups & doctor consultation logs
          </p>
        </div>
        <AudioSpeakerButton
          text={`${t.myHealthLog}. Here are your saved checkup results.`}
          label="Listen"
          size="sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 font-semibold">
          Loading your medical history…
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state-card">
          <span className="text-5xl mb-3">🌿</span>
          <h3 className="text-lg font-bold text-gray-800">{t.noHistory}</h3>
          <p className="text-sm text-gray-600 mt-1 max-w-md">
            Whenever you check a symptom or speak to the assistant, your advice will be automatically saved here for you and your health worker to review.
          </p>
        </div>
      ) : (
        <div className="history-cards-stack">
          {history.map((record) => {
            const dateStr = new Date(record.createdAt).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const narration = `${record.conditionName}. Consulted on ${dateStr}. Remedies: ${(record.tipsGiven || []).join('. ')}`;

            return (
              <div key={record._id} className="history-record-card">
                <div className="history-record-icon">
                  <span>{record.icon || '🩺'}</span>
                </div>
                <div className="history-record-main">
                  <div className="flex items-center justify-between">
                    <h4 className="history-condition-title">
                      {record.conditionName}
                    </h4>
                    <span className={`risk-badge ${
                      record.severity === 'emergency' ? 'risk-emergency' :
                      record.severity === 'moderate' ? 'risk-moderate' : 'risk-mild'
                    }`}>
                      {record.severity}
                    </span>
                  </div>
                  <span className="history-timestamp">📅 {dateStr}</span>

                  {record.tipsGiven && record.tipsGiven.length > 0 && (
                    <ul className="history-tips-preview">
                      {record.tipsGiven.slice(0, 2).map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="history-record-actions">
                  <AudioSpeakerButton
                    text={narration}
                    label="Replay Advice"
                    size="sm"
                  />
                  {record.conditionId !== 'emergency_sos' && (
                    <button
                      onClick={() => onSelectCondition(record.conditionId)}
                      className="view-full-advice-btn"
                    >
                      Open Card ➔
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
