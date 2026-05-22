import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Matchmaking from './components/UI/Matchmaking';
import GamePage from './components/Game/GamePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Matchmaking />} />
        <Route path="/game/:roomId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
