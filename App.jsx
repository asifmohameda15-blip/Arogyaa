import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import VoiceAssistant from './components/VoiceAssistant';
import VisualBodyMap from './components/VisualBodyMap';
import SymptomGrid from './components/SymptomGrid';
import TriageModal from './components/TriageModal';
import EmergencySOS from './components/EmergencySOS';
import IlliterateAuthModal from './components/IlliterateAuthModal';
import ConsultationHistory from './components/ConsultationHistory';
import HealthWorkersList from './components/HealthWorkersList';
import confetti from 'canvas-confetti';

export default function App() {
  const { language, t, speak } = useLanguage();
  const { user, isAuthenticated, token } = useAuth();

  const [conditions, setConditions] = useState([]);
  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'bodymap' | 'workers' | 'history'
  const [selectedConditionData, setSelectedConditionData] = useState(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all conditions from backend API
  useEffect(() => {
    fetch('/api/conditions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setConditions(data.data);
        }
      })
      .catch(err => console.error('Failed to load conditions:', err));
  }, []);

  // Handle Voice / Search Query
  const handleTriageQuery = async (query) => {
    if (!query) return;
    setIsSearching(true);
    setSearchQuery(query);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/triage/check', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: query,
          language
        })
      });

      const data = await res.json();

      if (data.isEmergency) {
        setIsEmergencyModalOpen(true);
      } else if (data.matched && data.condition) {
        setSelectedConditionData(data);
        try {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
        } catch (e) {}
      } else {
        // No direct match
        speak(data.audioText || t.searchPlaceholder);
      }
    } catch (err) {
      console.error('Triage search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle direct selection of a condition by ID
  const handleSelectCondition = async (conditionId) => {
    setIsSearching(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/triage/check', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          conditionId,
          language
        })
      });

      const data = await res.json();
      if (data.matched && data.condition) {
        setSelectedConditionData(data);
      }
    } catch (err) {
      console.error('Select condition error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="app-shell">
      {/* Top Accessible Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="main-viewport">
        {/* Tab 1: Voice & Picture Triage */}
        {activeTab === 'triage' && (
          <div className="tab-pane fade-in">
            {/* Voice Assistant AI Hero Bar */}
            <VoiceAssistant
              onSearch={handleTriageQuery}
              isSearching={isSearching}
            />

            {/* Visual Body Map Callout Banner */}
            <div
              onClick={() => setActiveTab('bodymap')}
              className="body-map-banner-teaser cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧍</span>
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-sm">
                    {t.bodyMapTitle}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Cannot read or type? Tap the human body picture directly!
                  </p>
                </div>
              </div>
              <span className="teaser-arrow">Touch Body Map ➔</span>
            </div>

            {/* Quick Symptom Cards Grid */}
            <SymptomGrid
              conditions={conditions}
              onSelectCondition={handleSelectCondition}
              onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Visual Body Silhouette Map */}
        {activeTab === 'bodymap' && (
          <div className="tab-pane fade-in">
            <VisualBodyMap
              onSelectBodyPart={(part) => console.log('Selected part:', part)}
              onSelectCondition={handleSelectCondition}
            />
          </div>
        )}

        {/* Tab 3: Community Health Workers */}
        {activeTab === 'workers' && (
          <div className="tab-pane fade-in">
            <HealthWorkersList />
          </div>
        )}

        {/* Tab 4: Patient Health History */}
        {activeTab === 'history' && (
          <div className="tab-pane fade-in">
            <ConsultationHistory
              onSelectCondition={handleSelectCondition}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <TriageModal
        triageResult={selectedConditionData}
        onClose={() => setSelectedConditionData(null)}
        onOpenEmergency={() => {
          setSelectedConditionData(null);
          setIsEmergencyModalOpen(true);
        }}
        onGoToWorkers={() => {
          setSelectedConditionData(null);
          setActiveTab('workers');
        }}
      />

      <EmergencySOS
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        queryText={searchQuery}
      />

      <IlliterateAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Persistent Bottom Emergency Floater */}
      <div className="bottom-emergency-floater">
        <div className="floater-content">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <span className="text-xs font-bold text-red-950">
              Emergency? 108 is Free & 24/7
            </span>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="floater-sos-btn"
          >
            Call 108
          </button>
        </div>
      </div>
    </div>
  );
}
