import React from 'react';
import { useGameStore } from '../../store/gameStore';

const TurnIndicator = () => {
    const { playerTurn } = useGameStore();

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 30px',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
            border: '2px solid',
            borderColor: playerTurn === 1 ? '#3498db' : '#e74c3c'
        }}>
            TURN: PLAYER {playerTurn}
        </div>
    );
};

export default TurnIndicator;
