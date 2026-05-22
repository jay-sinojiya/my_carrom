import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, sendMessage, disconnectSocket } from "../../services/socket";
import { useGameStore } from "../../store/gameStore";

const btnStyle = (bg, shadow) => ({
  background: bg, border: 'none', padding: '14px 36px', borderRadius: '30px',
  color: 'white', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
  boxShadow: `0 4px 15px ${shadow}`, transition: 'transform 0.2s, opacity 0.2s',
  minWidth: '200px',
});

const DifficultyBtn = ({ level, selected, onClick }) => {
  const colors = { easy: '#4caf50', medium: '#ff9800', hard: '#ef5350' };
  const color = colors[level];
  return (
    <button
      onClick={() => onClick(level)}
      style={{
        padding: '8px 20px', borderRadius: '20px', border: `2px solid ${color}`,
        background: selected ? color : 'transparent', color: selected ? 'white' : color,
        fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
        textTransform: 'capitalize',
      }}
    >{level}</button>
  );
};

export default function Matchmaking() {
  const [status, setStatus] = useState("idle");
  const [difficulty, setDifficulty] = useState("medium");
  const navigate = useNavigate();
  const { setPlayer, setBotGame, setBotDifficulty } = useGameStore();

  useEffect(() => {
    connectSocket("matchmaking", (data) => {
      if (data.type === "waiting") {
        setStatus("Waiting for an opponent...");
      } else if (data.type === "match_found") {
        setPlayer(data.player);
        setBotGame(false);
        navigate(`/game/${data.room}`);
      } else if (data.type === "cancelled") {
        setStatus("idle");
      }
    });
    return () => disconnectSocket();
  }, [navigate, setPlayer, setBotGame]);

  const findMatch = () => {
    setStatus("Searching for opponent...");
    sendMessage({ type: "find_match" });
  };

  const playVsBot = () => {
    setPlayer(1);
    setBotGame(true);
    setBotDifficulty(difficulty);
    navigate(`/game/bot-${Date.now()}`);
  };

  const cancelMatch = () => {
    sendMessage({ type: "cancel_match" });
    setStatus("idle");
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100vh', width: '100vw', fontFamily: 'Outfit, sans-serif', color: 'white',
      background: 'radial-gradient(ellipse at center, #2c1f0e 0%, #1a1108 100%)',
    }}>
      {/* Title */}
      <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', letterSpacing: '3px', textShadow: '0 4px 20px rgba(200,140,60,0.6)', color: '#f5c87a' }}>
        🪙 My Carrom
      </h1>
      <p style={{ color: '#8a7050', marginBottom: '3rem', fontSize: '1rem' }}>
        The Classic Board Game — Now Online
      </p>

      {status === "idle" ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          {/* Play Online */}
          <button
            onClick={findMatch}
            style={btnStyle('linear-gradient(135deg, #4CAF50, #2E7D32)', 'rgba(76, 175, 80, 0.4)')}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            🌐 Play Online
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#6b5540', width: '260px' }}>
            <div style={{ flex: 1, height: '1px', background: '#3d2b1a' }} />
            <span style={{ fontSize: '0.9rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#3d2b1a' }} />
          </div>

          {/* Difficulty Selector */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
            {['easy', 'medium', 'hard'].map(lvl => (
              <DifficultyBtn key={lvl} level={lvl} selected={difficulty === lvl} onClick={setDifficulty} />
            ))}
          </div>

          {/* Play vs Bot */}
          <button
            onClick={playVsBot}
            style={btnStyle('linear-gradient(135deg, #e67e22, #c0392b)', 'rgba(230, 126, 34, 0.4)')}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            🤖 Play vs Bot
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '2.5rem', animation: 'spin 1.5s linear infinite' }}>⌛</div>
          <p style={{ fontSize: '1.5rem', color: '#c9a96e' }}>{status}</p>
          <button
            onClick={cancelMatch}
            style={{
              background: 'transparent', border: '2px solid #ef5350', padding: '10px 30px',
              borderRadius: '30px', color: '#ef5350', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#ef5350'; e.currentTarget.style.color = 'white'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef5350'; }}
          >
            Cancel
          </button>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
