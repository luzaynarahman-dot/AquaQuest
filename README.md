# AquaQuest

> Explore · Navigate · Discover

A mobile-first Progressive Web App for freshwater citizen science — observe water health, report concerns, and take action together.

![PWA](https://img.shields.io/badge/PWA-Installable-7C3AED?style=flat-square)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla%20ES6%2B-F7DF1E?style=flat-square)
![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-222222?style=flat-square)

---

## 🌊 What is AquaQuest?

AquaQuest is a mobile-first Progressive Web App that turns freshwater citizen science into a guided, evidence-supported, community-driven experience.

The platform allows users to:

- **Explore** waterbodies through a map and site directory
- **Observe** water conditions using a 5-step guided workflow
- **Attach photo evidence** to observations and reports
- **Report environmental concerns** like pollution or litter
- **Understand findings** through One Health Insight cards
- **Join community challenges** like cleanups and streaks
- **Track impact** through points, levels, and badges
- **Learn** about freshwater ecosystems and biodiversity
- **Share stories** through a community feed

The core flow is: **Explore → Observe → Understand → Contribute → Act.**

---

## ✨ Features

- 🗺️ Interactive community map (Leaflet.js)
- 🔎 Guided 5-step observation workflow
- 📸 Photo-supported observations
- 🚩 Pollution concern reporting
- 🧠 One Health Insight cards
- 🤝 Community challenges and actions
- 🏆 Gamification (points, badges, streaks)
- 📚 Educational content library
- 📖 Community feed with threaded comments
- 👤 Personal impact profile
- 📱 Installable PWA with offline support

---

## 🛠️ Tech Stack

- **HTML5, CSS3, Vanilla JavaScript (ES6+)**
- Leaflet.js — interactive mapping
- Chart.js — data visualization
- Font Awesome — icons
- LocalStorage API — persistence
- Service Worker + Web App Manifest — PWA
- Canvas Confetti — user feedback
- jsPDF — data export

---

## 🏗️ Architecture

Modular single-page application organized into:

```

js/
├── core/       → app, storage, mode, theme, toast
├── data/       → sites, challenges, learn topics
├── services/   → mock API layer
├── features/   → observations, contributions, gamification
├── pages/      → home, map, observe, feed, profile
└── ui/         → drawer, onboarding, skeleton

```

---

## 🚀 Getting Started

### Option 1: Run Locally

```bash
# Clone the repository
git clone https://github.com/luzaynarahman-dot/AquaQuest.git

# Navigate into the folder
cd AquaQuest

# Start a local server
python -m http.server 8000

# Open in browser
http://localhost:8000
```

Option 2: Try Live Demo

🔗 Live: https://luzaynarahman-dot.github.io/AquaQuest/

Option 3: Install as PWA

· Open the live link on mobile
· Tap "Add to Home Screen"
· Launch from home screen

---

📱 Progressive Web App

· ✅ Installable on mobile home screen
· ✅ Offline-first with service worker
· ✅ Static asset caching
· ✅ Background sync ready

---

🎯 Use Cases

· Citizens — Record and share water observations
· Communities — Organize cleanups and campaigns
· Researchers — Access structured citizen science data
· Students — Learn about freshwater ecosystems
· Local authorities — Identify recurring environmental issues

---

📊 Prototype Data

This is a frontend prototype that uses:

· Mock service layer simulating backend APIs
· LocalStorage for persistence
· Demo mode with rich seeded data (11 users, 15 stories, 60+ comments)

The architecture is designed so a real backend can be integrated later without rebuilding the UI.

---

🗺️ Roadmap

☐ Production backend with cloud database
☐ Real-time multi-user synchronization
☐ AI-supported observation validation
☐ Researcher dashboard
☐ Multi-language support (Bangla)
☐ Sensor data integration

---

📂 Project Structure

```
AquaQuest/
├── index.html
├── manifest.json
├── sw.js
├── offline.html
├── assets/
├── css/
└── js/
    ├── app.js
    ├── core/
    ├── data/
    ├── services/
    ├── features/
    ├── pages/
    ├── ui/
    ├── demo-data.js
    ├── demo.js
    └── pwa.js
```

---

👤 About the Developer

Luzayna Rahman — Solo developer from Cox's Bazar, Bangladesh.

Built entirely on an Android phone using the Acode editor.

🔗 GitHub: https://github.com/luzaynarahman-dot

---

📜 License

MIT License — free to use, modify, and distribute.

---

🌊 AquaQuest

Cleaner observations. Better understanding. Stronger communities.

Observe. Understand. Act.