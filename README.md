# 🩺 Arogyaa Med-Tech Web Application
> **Voice-First & Visual Healthcare Triage for Everyone — Accessible Even to Illiterate & Low-Literacy Users**

---

## 📖 1. Theme & Motto of the Web Page

### 🎯 Found in the Workspace (`Healer.html`):
- **Project Name:** **Arogyaa** (ஆரோக்கியா / आरोग्य / ആരോഗ്യം / ఆరోగ్యం / ಆರೋಗ್ಯ — meaning *Wholeness, Vitality & Good Health*)
- **Theme:** Accessible Med-Tech First-Aid & Triage Assistant for rural, semi-urban, and low-literacy communities.
- **Motto:** 
  > *"Healthcare for Everyone, Everywhere — Simple, Voice-Guided, Visual First Aid & Medical Guidance for All, Regardless of Literacy."*
- **Core Mission:**
  To eliminate literacy and language barriers in healthcare. Anyone who cannot read or write can speak in their native tongue or simply touch the part of the body picture that hurts, immediately hear clear audio remedies, recognize red-flag medical warnings, and trigger life-saving emergency actions (108 Ambulance).

---

## 🚀 2. Full MERN Stack Architecture

The application is built using the **MERN** stack:
- **M (MongoDB / Mongoose):** Persistent document store with automatic local JSON engine fallback ensuring zero crashes even without a running MongoDB daemon.
- **E (Express.js):** REST API with modular routers (`/api/auth`, `/api/conditions`, `/api/triage`, `/api/emergency`).
- **R (React.js + Vite):** Fast, modern, responsive frontend with Web Speech API (Speech Recognition + Speech Synthesis), SVG Interactive Body Map, and touch-first accessibility.
- **N (Node.js):** Cross-platform runtime executing the unified full-stack application.

---

## 🔐 3. User-Based Authentication Tailored for Illiterate Users

Illiterate and elderly users often struggle with complex email addresses and 12-character passwords. Arogyaa solves this with:
1. **Visual Avatar Selection:** Choose a friendly patient picture (👵 Grandmother, 👴 Grandfather, 👨 Father, 👩 Mother, 👦 Boy, 👧 Girl, 🧕 Sister, 🧑 Elder).
2. **4-Digit Secret PIN:** Simple ATM-style PIN keypad with audio readout of digits.
3. **Audio Guidance:** Built-in voice prompts instruct: *"Please tap your picture and enter your 4-digit secret PIN"*.
4. **1-Tap Quick Demo Patient Access:** Instant 1-click access as "Kamala Amma" for quick testing without typing.
5. **Security:** Passwords/PINs are salted and hashed using `bcryptjs`, and sessions are verified using `jsonwebtoken` (JWT).

---

## ♿ 4. Accessibility Innovations for Illiterate & Low-Literacy Users

1. **🧍 Interactive Visual Human Body Map ("Tap Where It Hurts"):**
   - Anatomical silhouette with glowing touch hotspots for:
     - 🤕 **Head & Neck:** Headache, Dizziness, Heat exhaustion
     - 🤧 **Throat & Lungs:** Cough, Cold, Sore throat, Asthma
     - 🤢 **Stomach & Belly:** Stomach ache, Vomiting, Loose motion/Diarrhea
     - 🦵 **Back, Legs & Joints:** Sprains, Knee pain, Swelling
     - 🩹 **Skin & Surface:** Cuts, Burns, Rashes, Allergies
     - 🤒 **Whole Body:** High fever, Chills
     - 🚨 **Emergency Siren Hotspot:** Chest pain, Snake bite, Heavy bleeding
2. **🎤 Real-Time Multilingual Voice Input (Speech-to-Text):**
   - Big, pulsing microphone button supporting 6 languages:
     - 🌐 English (`en-IN`)
     - 🇮🇳 தமிழ் (Tamil - `ta-IN`)
     - 🇮🇳 हिन्दी (Hindi - `hi-IN`)
     - 🇮🇳 മലയാളം (Malayalam - `ml-IN`)
     - 🇮🇳 తెలుగు (Telugu - `te-IN`)
     - 🇮🇳 ಕನ್ನಡ (Kannada - `kn-IN`)
3. **🔊 Audio Voice Narration (Text-to-Speech) for Everything:**
   - Every condition, symptom card, home remedy, and warning sign has an interactive **"🔊 Listen to Advice"** button with animated soundwaves.
4. **🚨 Emergency 108 Speed-Dial & Loud Alarm:**
   - Detects life-threatening symptoms (heart attack, breathing distress, poison, snake bite, severe bleeding) and triggers an emergency modal with direct 1-tap `tel:108` calling.
5. **👩‍⚕️ Community Health Workers (ASHA / ANM) Hub:**
   - Frontline rural health responders with picture avatars and 1-tap direct phone calling.
6. **📋 Patient Health Log:**
   - Saves consultations to user's history so family members and doctors can replay past advice.

---

## 🛠️ 5. Running the Application

### Option A: Unified Full-Stack Run (Easiest)
```powershell
cd "c:\Users\moham\Desktop\Web site\arogyaa-medtech\server"
node server.js
```
The server will start and serve both the API and the React frontend on:
👉 **http://localhost:5000**

### Option B: Development Mode (Vite Hot-Reload)
**Terminal 1 (Backend API):**
```powershell
cd "c:\Users\moham\Desktop\Web site\arogyaa-medtech\server"
node server.js
```
**Terminal 2 (Frontend Client):**
```powershell
cd "c:\Users\moham\Desktop\Web site\arogyaa-medtech\client"
npm run dev
```
👉 Open **http://localhost:3000**
