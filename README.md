# 🪙 My Carrom — Multiplayer 3D Web Game

A modern, real-time multiplayer 3D Carrom game built with **React**, **Three.js (React Three Fiber)**, **Rapier Physics**, and **Django Channels**.

---

## 🚀 Key Features

*   **Premium 3D Visuals**: Curated board aesthetics, shadows, custom textures, and smooth animations using Three.js and React Three Fiber.
*   **High-Fidelity Physics**: Realistic collisions, rebounds, and friction calculated via Rapier 3D physics with Continuous Collision Detection (CCD) to prevent boundary tunneling.
*   **Play Modes**:
    *   🤖 **Vs Bot**: Local play against an intelligent AI bot with adjustable difficulty levels.
    *   🌐 **Online Multiplayer**: Real-time matchmaking and gameplay synced via WebSockets.
*   **Sleek Controls**:
    *   Linear slider to position the striker along your active baseline.
    *   Intransitive drag aiming controls (slingshot mechanical style) with motion detection lockout.

---

## 📁 Project Structure

```
my_carrom/
├── backend/            # Django ASGI backend
│   ├── backend/        # Configuration (settings, urls, routing)
│   ├── game/           # Channels consumers, game logic, matchmaking
│   ├── venv/           # Python virtual environment
│   ├── db.sqlite3      # Local database file
│   └── requirements.txt
├── frontend/           # Vite / React frontend
│   ├── public/         # Static assets
│   ├── src/            # Components, hooks, store, services
│   └── package.json
├── .gitignore          # Root Git ignore rules
└── README.md           # Project Documentation
```

---

## 🛠️ Getting Started

### 1. Backend Setup (Django ASGI Server)

#### Prerequisites
*   Python 3.10+
*   Redis server running locally on `localhost:6379` (used for Django Channels channel layer)

#### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the ASGI development server:
   ```bash
   python manage.py runserver 8000
   ```

---

### 2. Frontend Setup (React App)

#### Prerequisites
*   Node.js 18+

#### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node modules:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Access the game at `http://localhost:5173/` (or the terminal-specified local URL).

---

## 🎮 Gameplay & Controls

*   **Striker Positioning**: When it is your turn and pieces are still, use the horizontal range slider at the bottom of the screen to position the striker along the baseline.
*   **Aiming & Shooting**: Click and drag backward on the striker (slingshot style) to set the direction and power, then release to strike.
*   **Safety Features**: The striker is locked from aiming while pieces are still moving. If any coin or striker glitches outside the board bounds, it is automatically caught and reset back into play.
