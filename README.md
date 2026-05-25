<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=58A6FF&center=true&vCenter=true&width=700&lines=🪙+My+Carrom;Multiplayer+3D+Web+Game;React+%C2%B7+Three.js+%C2%B7+Django+%C2%B7+WebSockets;Real+Physics+%C2%B7+AI+Bot+%C2%B7+Online+Play" alt="Typing SVG" />

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](#)
[![Rapier](https://img.shields.io/badge/Rapier_Physics-FF6B35?style=for-the-badge&logo=rust&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)

<br/>

![Stars](https://img.shields.io/github/stars/jay-sinojiya/my_carrom?style=flat-square&color=58A6FF)
![Last Commit](https://img.shields.io/github/last-commit/jay-sinojiya/my_carrom?style=flat-square&color=58A6FF)
![Repo Size](https://img.shields.io/github/repo-size/jay-sinojiya/my_carrom?style=flat-square&color=58A6FF)
![Issues](https://img.shields.io/github/issues/jay-sinojiya/my_carrom?style=flat-square&color=58A6FF)

</div>

---

> A modern, real-time multiplayer 3D Carrom game built with **React**, **Three.js (React Three Fiber)**,
> **Rapier Physics**, and **Django Channels** — running entirely in the browser.

---

## ✨ Features

| | Feature | Details |
|---|---|---|
| 🎨 | Premium 3D Visuals | Curated board aesthetics, shadows, custom textures and smooth animations via React Three Fiber |
| ⚙️ | High-Fidelity Physics | Rapier 3D — realistic collisions, rebounds, friction and CCD to prevent boundary tunneling |
| 🤖 | AI Bot Mode | Local play against an intelligent bot with adjustable difficulty levels |
| 🌐 | Online Multiplayer | Real-time matchmaking and gameplay synced via Django Channels + WebSockets |
| 🎯 | Slingshot Controls | Click and drag backward on striker to aim — motion detection locks striker while pieces move |
| 📐 | Striker Positioning | Linear slider to position striker precisely along your active baseline |
| 🔄 | Auto-Reset | Coins or striker glitching outside board bounds are automatically caught and reset |

---

## 🛠️ Tech Stack

**Frontend**

| Layer | Technology |
|---|---|
| UI Framework | React + Vite |
| 3D Engine | Three.js via React Three Fiber |
| Physics | Rapier 3D (WASM) with CCD |
| State | Zustand |

**Backend**

| Layer | Technology |
|---|---|
| Server | Django + Django Channels (ASGI) |
| Real-time | WebSocket consumers |
| Channel Layer | Redis on `localhost:6379` |
| Database | SQLite (local dev) |

---

## 📁 Project Structure

```
my_carrom/
├── backend/
│   ├── backend/        # Settings, URLs, ASGI routing
│   ├── game/           # WebSocket consumers, game logic, matchmaking
│   ├── db.sqlite3      # Local dev database
│   └── requirements.txt
├── frontend/
│   ├── public/         # Static assets & textures
│   ├── src/            # Components, hooks, store, services
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Redis running on `localhost:6379`

---

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start ASGI server
python manage.py runserver 8000
```

---

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser and start playing.

---

## 🎮 Gameplay & Controls

```
1. POSITION   →  Use the slider at the bottom to move striker along your baseline
2. AIM        →  Click and drag backward on striker (slingshot style)
3. SHOOT      →  Release to strike — power depends on drag distance
4. WAIT       →  Striker locks automatically while pieces are still moving
5. AUTO-FIX   →  Any piece outside board bounds resets automatically
```

**Play Modes:**
- 🤖 **Vs Bot** — single player against an AI opponent with adjustable difficulty
- 🌐 **Online** — matchmaking connects you to a real player instantly via WebSockets

---

## 🗺️ Roadmap

- [ ] Add gameplay screenshots and demo GIF
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway / Render
- [ ] Add scoring system and match history
- [ ] Mobile touch controls

---

## 👨‍💻 Built By

**Jay Sinojiya** — Frontend Developer

> Specialising in React, Three.js, AI-powered apps and dynamic PDF systems.
> Open to remote roles and freelance projects.

<br/>

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://jay-sinojiya-portfolio-369.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sinojiya-jay-22760a209)
[![Gmail](https://img.shields.io/badge/Email_Me-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sinojiyajay3@gmail.com)

---

<div align="center">
<sub>⚡ If you found this interesting, drop a ⭐ — it genuinely helps!</sub>
</div>

</div>
