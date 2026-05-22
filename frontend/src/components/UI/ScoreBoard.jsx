import React from 'react';
import { useGameStore } from '../../store/gameStore';

const ScoreBoard = () => {
    const { score, playerTurn } = useGameStore();

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '12px',
            fontFamily: 'Outfit, sans-serif',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: 600 }}>Score Board</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PLAYER 1</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{score.player1}</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
                <div>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PLAYER 2</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{score.player2}</div>
                </div>
            </div>
            <div style={{ marginTop: '15px' }}>
                Current Turn: <span style={{ color: '#3498db' }}>PLAYER {playerTurn}</span>
            </div>
        </div>
    );
};

export default ScoreBoard;
