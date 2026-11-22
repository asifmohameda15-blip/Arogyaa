import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import AudioSpeakerButton from './AudioSpeakerButton';

export default function HealthWorkersList() {
  const { language, t, speak } = useLanguage();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/emergency/health-workers')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setWorkers(data.data);
        }
      })
      .catch(err => console.error('Error fetching workers:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="workers-container">
      <div className="section-header-row mb-4">
        <div>
          <h2 className="section-heading flex items-center gap-2">
            <span>👩‍⚕️</span>
            <span>{t.healthWorkers}</span>
          </h2>
          <p className="section-subheading">{t.healthWorkersSub}</p>
        </div>
        <AudioSpeakerButton
          text={`${t.healthWorkers}. Here is the list of your local community health workers and ASHA workers. You can tap Call to talk directly with them.`}
          label="Listen"
          size="sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 font-semibold">
          Finding nearby health responders…
        </div>
      ) : (
        <div className="workers-grid">
          {workers.map((worker) => {
            const narration = `${worker.name}, ${worker.role} at ${worker.area}. Status: ${worker.availability}. Phone: ${worker.phone}.`;

            return (
              <div key={worker.id} className="worker-card">
                <div className="worker-header">
                  <span className="worker-avatar">{worker.avatar}</span>
                  <div className="worker-info">
                    <h3 className="worker-name">{worker.name}</h3>
                    <p className="worker-role">{worker.role}</p>
                    <p className="worker-area">📍 {worker.area}</p>
                  </div>
                </div>

                <div className="worker-meta my-2">
                  <span className="worker-status-badge">
                    🟢 {worker.availability}
                  </span>
                </div>

                <div className="worker-actions">
                  <AudioSpeakerButton
                    text={narration}
                    label="Listen Details"
                    size="sm"
                  />
                  <a
                    href={`tel:${worker.phone.replace(/[^0-9+]/g, '')}`}
                    className="worker-call-btn"
                  >
                    <span>📞</span>
                    <span>{t.callNow}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
