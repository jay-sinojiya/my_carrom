<div align="center">

# 🪙 My Carrom

**A multiplayer 3D Carrom game — real physics, AI bot, and live online play**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](#)
[![Rapier](https://img.shields.io/badge/Rapier_Physics-FF6B35?style=for-the-badge&logo=rust&logoColor=white)](#)

![Stars](https://img.shields.io/github/stars/jay-sinojiya/my_carrom?style=flat-square&color=58A6FF)
![Last Commit](https://img.shields.io/github/last-commit/jay-sinojiya/my_carrom?style=flat-square&color=58A6FF)
![Repo Size](https://img.shields.io/github/repo-size/jay-sinojiya/my_carrom?style=flat-square&color=58A6FF)

</div>

---

> A modern web-based Carrom board game featuring a high-fidelity 3D engine,
> realistic physics simulation, an AI opponent, and real-time online multiplayer
> via WebSockets — all running in the browser.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎮 3D Board | Premium visuals with shadows, textures and smooth animations via React Three Fiber |
| ⚙️ Physics | Rapier 3D physics — realistic collisions, rebounds, friction and CCD boundary detection |
| 🤖 AI Bot | Play vs an intelligent bot with adjustable difficulty levels |
| 🌐 Online Multiplayer | Real-time matchmaking and gameplay synced via Django Channels + WebSockets |
| 🎯 Slingshot Controls | Drag-to-aim striker with motion detection lockout while pieces are moving |
| 📐 Striker Positioning | Linear slider to position striker along the active baseline |
| 🔄 Auto-reset | Coins or striker glitching outside bounds are automatically caught and reset |

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Three.js via React Three Fiber
- Rapier 3D Physics (WASM)
- Zustand (state management)

**Backend**
- Django + Django Channels (ASGI)
- Redis (channel layer for WebSockets)
- WebSocket consumers for real-time game sync

---

## 📁 Project Structure

```
my_carrom/
├── backend/
│   ├── backend/        # Settings, URLs, ASGI routing
│   ├── game/           # WebSocket consumers, game logic, matchmaking
│   └── requirements.txt
├── frontend/
│   ├── public/         # Static assets & textures
│   └── src/            # Components, hooks, store, game services
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Redis running on `localhost:6379`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and start playing.

---

## 🎮 How to Play

1. **Position your striker** — use the slider at the bottom to move it along your baseline
2. **Aim and shoot** — click and drag backward on the striker (slingshot style), release to strike
3. **Wait your turn** — striker locks while pieces are in motion
4. **Online mode** — matchmaking connects you automatically to another player in real time

---

## 🗺️ Roadmap

- [ ] Add screenshots and gameplay GIF
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway / Render
- [ ] Add scoring system and match history
- [ ] Mobile touch controls

---

## 👨‍💻 Built By

**Jay Sinojiya** — Frontend Developer

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=flat-square&logo=vercel&logoColor=white)](https://jay-sinojiya-portfolio-369.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sinojiya-jay-22760a209)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:sinojiyajay3@gmail.com)
