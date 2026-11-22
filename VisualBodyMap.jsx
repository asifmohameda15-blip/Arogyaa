import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import AudioSpeakerButton from './AudioSpeakerButton';

export default function VisualBodyMap({ onSelectBodyPart, onSelectCondition }) {
  const { t, speak } = useLanguage();
  const [hoveredPart, setHoveredPart] = useState(null);

  const bodyHotspots = [
    {
      id: 'head',
      label: 'Head & Neck',
      labelNative: 'தலை / सिर / തല / తల / ತಲೆ',
      symptom: 'Headache & Dizziness',
      conditionId: 'head',
      icon: '🤕',
      color: '#3b82f6',
      badge: 'Headache'
    },
    {
      id: 'chest_throat',
      label: 'Throat & Lungs',
      labelNative: 'தொண்டை & நெஞ்சு / गला व छाती / തൊണ്ട / గొంతు / ಗಂಟಲು',
      symptom: 'Cough, Cold & Sore Throat',
      conditionId: 'cold',
      icon: '🤧',
      color: '#06b6d4',
      badge: 'Cough / Cold'
    },
    {
      id: 'stomach',
      label: 'Stomach & Tummy',
      labelNative: 'வயிறு / पेट / വയർ / కడుపు / ಹೊಟ್ಟೆ',
      symptom: 'Stomach Pain, Vomit & Loose Motion',
      conditionId: 'stomach',
      icon: '🤢',
      color: '#10b981',
      badge: 'Stomach Ache'
    },
    {
      id: 'limbs',
      label: 'Back, Legs & Joints',
      labelNative: 'முதுகு, மூட்டு, கால்கள் / कमर, जोड़ व पैर / സന്ധികൾ / కీళ్లు / ಕೀಲುಗಳು',
      symptom: 'Body Ache, Knee Pain & Sprain',
      conditionId: 'pain',
      icon: '🦵',
      color: '#8b5cf6',
      badge: 'Joint Pain'
    },
    {
      id: 'skin',
      label: 'Skin & Surface',
      labelNative: 'தோல் & காயம் / त्वचा व घाव / ചർമ്മം / చర్మం / ಚರ್ಮ',
      symptom: 'Rash, Cuts, Burns & Itching',
      conditionId: 'skin',
      icon: '🩹',
      color: '#f59e0b',
      badge: 'Skin / Cuts'
    },
    {
      id: 'whole_body',
      label: 'Whole Body / Fever',
      labelNative: 'முழு உடல் காய்ச்சல் / पूरे शरीर में बुखार / പനി / జ్వరం / ಜ್ವರ',
      symptom: 'High Temperature & Chills',
      conditionId: 'fever',
      icon: '🤒',
      color: '#ef4444',
      badge: 'Fever'
    }
  ];

  const handleSpotClick = (spot) => {
    speak(`${spot.label}. ${spot.symptom}`);
    onSelectCondition(spot.conditionId);
  };

  return (
    <div className="body-map-container">
      <div className="body-map-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-heading flex items-center gap-2">
              <span>🧍</span>
              <span>{t.bodyMapTitle}</span>
            </h2>
            <p className="section-subheading">{t.bodyMapSub}</p>
          </div>
          <AudioSpeakerButton
            text={`${t.bodyMapTitle}. ${t.bodyMapSub}`}
            label="Listen"
            size="sm"
          />
        </div>
      </div>

      <div className="body-map-interactive-grid">
        {/* Interactive SVG Human Body Graphic */}
        <div className="body-svg-frame">
          <svg
            viewBox="0 0 300 480"
            className="human-body-svg"
            role="img"
            aria-label="Human Body Touch Map"
          >
            {/* Background Human Silhouette */}
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1fae5" />
                <stop offset="100%" stopColor="#a7f3d0" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Silhouette Outline */}
            <path
              d="M 150 25 C 130 25 120 45 120 65 C 120 85 130 95 140 100 
                 L 115 110 C 95 118 80 135 75 160 L 60 250 C 55 270 70 280 80 270 
                 L 95 195 L 105 270 L 110 370 L 95 440 C 90 460 110 465 120 450 
                 L 140 370 L 150 280 L 160 370 L 180 450 C 190 465 210 460 205 440 
                 L 190 370 L 195 270 L 205 195 L 220 270 C 230 280 245 270 240 250 
                 L 225 160 C 220 135 205 118 185 110 L 160 100 
                 C 170 95 180 85 180 65 C 180 45 170 25 150 25 Z"
              fill="url(#bodyGrad)"
              stroke="#0f7a5c"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Hotspot 1: Head */}
            <g
              className="hotspot-group cursor-pointer"
              onClick={() => handleSpotClick(bodyHotspots[0])}
              onMouseEnter={() => setHoveredPart('head')}
              onMouseLeave={() => setHoveredPart(null)}
            >
              <circle
                cx="150"
                cy="62"
                r="30"
                className={`hotspot-circle ${hoveredPart === 'head' ? 'hotspot-active' : ''}`}
                fill="#3b82f6"
                fillOpacity="0.35"
                stroke="#1d4ed8"
                strokeWidth="3"
              />
              <text x="150" y="68" textAnchor="middle" fontSize="22" pointerEvents="none">
                🤕
              </text>
            </g>

            {/* Hotspot 2: Throat & Chest */}
            <g
              className="hotspot-group cursor-pointer"
              onClick={() => handleSpotClick(bodyHotspots[1])}
              onMouseEnter={() => setHoveredPart('chest_throat')}
              onMouseLeave={() => setHoveredPart(null)}
            >
              <circle
                cx="150"
                cy="140"
                r="32"
                className={`hotspot-circle ${hoveredPart === 'chest_throat' ? 'hotspot-active' : ''}`}
                fill="#06b6d4"
                fillOpacity="0.35"
                stroke="#0891b2"
                strokeWidth="3"
              />
              <text x="150" y="146" textAnchor="middle" fontSize="22" pointerEvents="none">
                🤧
              </text>
            </g>

            {/* Hotspot 3: Stomach */}
            <g
              className="hotspot-group cursor-pointer"
              onClick={() => handleSpotClick(bodyHotspots[2])}
              onMouseEnter={() => setHoveredPart('stomach')}
              onMouseLeave={() => setHoveredPart(null)}
            >
              <circle
                cx="150"
                cy="215"
                r="34"
                className={`hotspot-circle ${hoveredPart === 'stomach' ? 'hotspot-active' : ''}`}
                fill="#10b981"
                fillOpacity="0.35"
                stroke="#047857"
                strokeWidth="3"
              />
              <text x="150" y="222" textAnchor="middle" fontSize="22" pointerEvents="none">
                🤢
              </text>
            </g>

            {/* Hotspot 4: Limbs & Legs */}
            <g
              className="hotspot-group cursor-pointer"
              onClick={() => handleSpotClick(bodyHotspots[3])}
              onMouseEnter={() => setHoveredPart('limbs')}
              onMouseLeave={() => setHoveredPart(null)}
            >
              <circle
                cx="120"
                cy="330"
                r="28"
                className={`hotspot-circle ${hoveredPart === 'limbs' ? 'hotspot-active' : ''}`}
                fill="#8b5cf6"
                fillOpacity="0.35"
                stroke="#6d28d9"
                strokeWidth="3"
              />
              <circle
                cx="180"
                cy="330"
                r="28"
                className={`hotspot-circle ${hoveredPart === 'limbs' ? 'hotspot-active' : ''}`}
                fill="#8b5cf6"
                fillOpacity="0.35"
                stroke="#6d28d9"
                strokeWidth="3"
              />
              <text x="150" y="337" textAnchor="middle" fontSize="22" pointerEvents="none">
                🦵
              </text>
            </g>

            {/* Hotspot 5: Skin & Arms */}
            <g
              className="hotspot-group cursor-pointer"
              onClick={() => handleSpotClick(bodyHotspots[4])}
              onMouseEnter={() => setHoveredPart('skin')}
              onMouseLeave={() => setHoveredPart(null)}
            >
              <circle
                cx="75"
                cy="210"
                r="24"
                className={`hotspot-circle ${hoveredPart === 'skin' ? 'hotspot-active' : ''}`}
                fill="#f59e0b"
                fillOpacity="0.35"
                stroke="#d97706"
                strokeWidth="3"
              />
              <circle
                cx="225"
                cy="210"
                r="24"
                className={`hotspot-circle ${hoveredPart === 'skin' ? 'hotspot-active' : ''}`}
                fill="#f59e0b"
                fillOpacity="0.35"
                stroke="#d97706"
                strokeWidth="3"
              />
              <text x="75" y="217" textAnchor="middle" fontSize="18" pointerEvents="none">
                🩹
              </text>
              <text x="225" y="217" textAnchor="middle" fontSize="18" pointerEvents="none">
                🩹
              </text>
            </g>
          </svg>
          <div className="text-center mt-2 text-xs font-semibold text-emerald-800">
            👆 Tap any glowing circle on the body picture
          </div>
        </div>

        {/* Visual Touch Buttons for Illiterate Easy Access */}
        <div className="body-parts-touch-list">
          {bodyHotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => handleSpotClick(spot)}
              onMouseEnter={() => setHoveredPart(spot.id)}
              onMouseLeave={() => setHoveredPart(null)}
              className={`body-part-touch-card ${
                hoveredPart === spot.id ? 'touch-card-highlight' : ''
              }`}
              style={{ borderLeftColor: spot.color }}
            >
              <span className="touch-card-icon">{spot.icon}</span>
              <div className="touch-card-details">
                <span className="touch-card-title">{spot.label}</span>
                <span className="touch-card-sub">{spot.symptom}</span>
                <span className="touch-card-native">{spot.labelNative}</span>
              </div>
              <span className="touch-card-arrow">👉</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
