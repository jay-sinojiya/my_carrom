import React from 'react';
import { useParams } from 'react-router-dom';
import CarromScene from './CarromScene';
import ScoreBoard from '../UI/ScoreBoard';
import TurnIndicator from '../UI/TurnIndicator';

export default function GamePage() {
  const { roomId } = useParams();
  
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CarromScene roomId={roomId} />
      <ScoreBoard />
      <TurnIndicator />
    </div>
  );
}
