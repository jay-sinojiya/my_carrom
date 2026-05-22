import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useThreeScene } from "../../hooks/useThreeScene";
import { usePhysics } from "../../hooks/usePhysics";
import { createBoard } from "./Board";
import { createCoin } from "./Coin";
import { createStriker } from "./Striker";
import AimController from "./AimController";
import AimLine from "./AimLine";
import { useGameStore } from "../../store/gameStore";
import { connectSocket, disconnectSocket, sendMessage } from "../../services/socket";
import { getBotMove } from "../../utils/bot";

const POCKET_RADIUS = 0.35;
const pockets = [
  { x: -2.8, z: -2.8 },
  { x: 2.8, z: -2.8 },
  { x: -2.8, z: 2.8 },
  { x: 2.8, z: 2.8 },
];

const isInPocket = (pos, pocket) => {
  const dx = pos.x - pocket.x;
  const dz = pos.z - pocket.z;
  return Math.sqrt(dx * dx + dz * dz) < POCKET_RADIUS;
};

const resetStriker = (striker) => {
  striker.body.setTranslation({ x: 0, y: 0.075, z: 2.3 }, true);
  striker.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
  striker.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
};

export default function CarromScene({ roomId }) {
  const { mountRef, sceneRef } = useThreeScene();
  const { worldRef, isReady } = usePhysics();
  
  const [striker, setStriker] = useState(null);
  const [dragVector, setDragVector] = useState(null);
  const [strikerX, setStrikerX] = useState(0);
  const strikerRef = useRef(null); // Ref for stable WebSocket closure access
  const coinsRef = useRef([]);
  const isTurnActive = useRef(false);
  const strikeTimeRef = useRef(0);
  const botTimeoutRef = useRef(null);
  const botHasPlayedRef = useRef(false);
  const canStrikeRef = useRef(true); // Strike cooldown lock
 
  // Effect 1: WebSocket Setup (runs once on roomId change)
  useEffect(() => {
    if (!roomId) return;
    connectSocket(roomId, (data) => {
      if (data.type === "strike") {
        if (data.player !== useGameStore.getState().playerId) {
          const { force, angle } = data;
          const x = Math.cos(angle) * force;
          const z = Math.sin(angle) * force;
          // Use a ref to access strikerObj safely
          strikerRef.current?.body.applyImpulse({ x, y: 0, z }, true);
          strikeTimeRef.current = Date.now();
          isTurnActive.current = true;
        }
      } else if (data.type === "turn") {
        useGameStore.getState().setTurn(data.nextTurn);
        // Reset striker on turn change to the appropriate baseline
        const zPos = data.nextTurn === 1 ? 2.3 : -2.3;
        strikerRef.current?.body.setTranslation({ x: 0, y: 0.075, z: zPos }, true);
        strikerRef.current?.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        strikerRef.current?.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        setStrikerX(0);
      } else if (data.type === "move_striker") {
        if (data.player !== useGameStore.getState().playerId) {
          strikerRef.current?.body.setTranslation({ x: data.x, y: 0.075, z: data.z }, true);
        }
      } else if (data.type === "sync_state") {
        if (useGameStore.getState().playerId !== useGameStore.getState().playerTurn) {
          if (data.coins && coinsRef.current.length === data.coins.length) {
            data.coins.forEach((pos, idx) => {
              const c = coinsRef.current[idx];
              c.body.setTranslation({ x: pos.x, y: 0.075, z: pos.z }, true);
              c.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
              c.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
            });
          }
        }
      }
    });
    
    return () => disconnectSocket();
  }, [roomId]); // Only runs when roomId changes

  // Effect 2: Game/Physics Setup (runs only once when Rapier is ready)
  useEffect(() => {
    if (!isReady || !worldRef.current) return;

    const scene = sceneRef.current;
    const world = worldRef.current;

    // Clear initial objects (preserving lights)
    while (scene.children.length > 2) {
      scene.remove(scene.children[scene.children.length - 1]);
    }

    createBoard(scene, world);

    // Coins layout (Classic Carrom Hexagon Formation)
    coinsRef.current = [];
    
    // Helper to spawn a coin and add it to refs
    const spawnCoin = (x, z, color) => {
      coinsRef.current.push(createCoin(scene, world, x, z, color));
    };

    const COIN_RADIUS = 0.22; // Slightly larger than actual radius 0.2 to prevent initial overlapping explosions
    
    // 1. Center Queen (Red)
    spawnCoin(0, 0, "red");

    // 2. Inner Ring (6 coins: alternating White/Black)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * (COIN_RADIUS * 2);
        const z = Math.sin(angle) * (COIN_RADIUS * 2);
        const color = i % 2 === 0 ? "white" : "black";
        spawnCoin(x, z, color);
    }

    // 3. Outer Ring (12 coins)
    // In classic carrom, the outer ring is 12 coins, alternating but grouped to fit the hex.
    // For simplicity of perfect placement, a radius multiplier of 4 works mathematically for the outer rim.
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        // The distance varies slightly because it's a hexagon, not a perfect circle.
        // We approximate the hex distance.
        // If index is even (vertices): radius = 4 * r. If odd (edges): radius = sqrt(3) * 2 * r ≈ 3.46 * r
        const distMultiplier = i % 2 === 0 ? 4 : 3.464; 
        const x = Math.cos(angle) * (COIN_RADIUS * distMultiplier);
        const z = Math.sin(angle) * (COIN_RADIUS * distMultiplier);
        
        // Colors alternate but depend on the alignment of the inner ring to form lines
        const color = i % 2 === 0 ? "black" : "white";
        spawnCoin(x, z, color);
    }

    const strikerObj = createStriker(scene, world);
    strikerRef.current = strikerObj;
    setStriker(strikerObj);

    let animationFrameId;
    const animate = () => {
      world.step();

      // Sync physics → render
      for (let i = coinsRef.current.length - 1; i >= 0; i--) {
        const coin = coinsRef.current[i];
        const pos = coin.body.translation();
        const rot = coin.body.rotation();
        coin.mesh.position.set(pos.x, pos.y, pos.z);
        coin.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

        // Out of bounds safety check for coins
        if (Math.abs(pos.x) > 3.1 || Math.abs(pos.z) > 3.1) {
          coin.body.setTranslation({ x: 0, y: 0.075, z: 0 }, true);
          coin.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
          coin.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
          continue;
        }

        // Pocket detection for coins
        for (let pocket of pockets) {
          if (isInPocket(pos, pocket)) {
            world.removeRigidBody(coin.body);
            scene.remove(coin.mesh);
            coinsRef.current.splice(i, 1);
            
            const { playerTurn, addScore } = useGameStore.getState();
            const player = playerTurn === 1 ? "player1" : "player2";
            addScore(player, 1);
            break;
          }
        }
      }

      if (strikerObj) {
        const pos = strikerObj.body.translation();
        const rot = strikerObj.body.rotation();
        strikerObj.mesh.position.set(pos.x, pos.y, pos.z);
        strikerObj.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

        // Out of bounds safety check for striker
        if (Math.abs(pos.x) > 3.1 || Math.abs(pos.z) > 3.1) {
          resetStriker(strikerObj);
          useGameStore.getState().switchTurn();
        } else {
          // Pocket detection for striker (Foul)
          for (let pocket of pockets) {
            if (isInPocket(pos, pocket)) {
              resetStriker(strikerObj);
              useGameStore.getState().switchTurn();
              break;
            }
          }
        }
      }

      // Check if turn ended (everything stopped moving, checking at least 500ms after a strike to prevent premature transition)
      if (isTurnActive.current && Date.now() - strikeTimeRef.current > 500) {
        let moving = false;
        for (let i = 0; i < coinsRef.current.length; i++) {
          const v = coinsRef.current[i].body.linvel();
          if (Math.abs(v.x) + Math.abs(v.z) > 0.05) moving = true;
        }
        if (strikerObj) {
          const v = strikerObj.body.linvel();
          if (Math.abs(v.x) + Math.abs(v.z) > 0.05) moving = true;
        }

        if (!moving) {
          isTurnActive.current = false;
          const { playerId, playerTurn, isBotGame, botDifficulty } = useGameStore.getState();

          if (isBotGame) {
            // In bot mode: Player 1 just finished → switch to bot (player 2) and fire
            if (playerTurn === 1 && !botHasPlayedRef.current) {
              useGameStore.getState().setTurn(2); // Switch turn first
              botHasPlayedRef.current = true;

              // Reset striker to Bot's baseline before Bot plays
              strikerObj.body.setTranslation({ x: 0, y: 0.075, z: -2.3 }, true);
              strikerObj.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
              strikerObj.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
              setStrikerX(0);

              const botDelay = 600 + Math.random() * 800;
              botTimeoutRef.current = setTimeout(() => {
                const move = getBotMove(
                  strikerObj.body.translation(),
                  coinsRef.current.map(c => c.body.translation()),
                  botDifficulty
                );
                if (move) {
                  const { angle, force } = move;
                  const x = Math.cos(angle) * force;
                  const z = Math.sin(angle) * force;
                  strikerObj.body.applyImpulse({ x, y: 0, z }, true);
                  strikeTimeRef.current = Date.now();
                  isTurnActive.current = true;
                }
              }, botDelay);
            } else if (playerTurn === 2) {
              // Bot just finished → give turn back to player 1
              useGameStore.getState().setTurn(1);

              // Reset striker to Player 1's baseline
              strikerObj.body.setTranslation({ x: 0, y: 0.075, z: 2.3 }, true);
              strikerObj.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
              strikerObj.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
              setStrikerX(0);

              setTimeout(() => { botHasPlayedRef.current = false; }, 500);
            }
          } else if (playerId === playerTurn) {
            // Online multiplayer: sync turn to opponent
            const next = playerId === 1 ? 2 : 1;
            sendMessage({ type: "turn", nextTurn: next });
            useGameStore.getState().setTurn(next);

            // Reset striker to the next player's baseline
            const zPos = next === 1 ? 2.3 : -2.3;
            strikerObj.body.setTranslation({ x: 0, y: 0.075, z: zPos }, true);
            strikerObj.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
            strikerObj.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
            setStrikerX(0);

            sendMessage({
              type: "sync_state",
              coins: coinsRef.current.map(c => ({
                x: c.body.translation().x,
                z: c.body.translation().z
              }))
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [isReady]);

  const { playerTurn, playerId } = useGameStore();

  const handleSliderChange = useCallback((val) => {
    if (!striker || isTurnActive.current) return;
    setStrikerX(val);
    const zPos = playerId === 1 ? 2.3 : -2.3;
    striker.body.setTranslation({ x: val, y: 0.075, z: zPos }, true);
    sendMessage({
      type: "move_striker",
      x: val,
      z: zPos,
      player: playerId,
      roomId
    });
  }, [striker, playerId, roomId]);

  const handleStrike = useCallback((force, angle) => {
    if (!canStrikeRef.current) return;
    canStrikeRef.current = false;
    strikeTimeRef.current = Date.now();
    isTurnActive.current = true;

    // Cooldown
    setTimeout(() => {
      canStrikeRef.current = true;
    }, 2000);

    sendMessage({
      type: "strike",
      force,
      angle,
      player: playerId,
      roomId
    });
  }, [roomId, playerId]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
      
      {isReady && striker && (
        <>
            <AimController 
                strikerBody={striker.body} 
                setDragVector={setDragVector} 
                onStrike={handleStrike}
            />
            <AimLine 
                scene={sceneRef.current} 
                strikerMesh={striker.mesh} 
                dragVector={dragVector} 
            />
        </>
      )}

      {/* Slider for striker positioning */}
      {isReady && striker && playerTurn === playerId && !isTurnActive.current && (
        <div style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '11px',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            <span>POSITION STRIKER</span>
            <span style={{ color: '#4da6ff' }}>{strikerX.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-1.8"
            max="1.8"
            step="0.01"
            value={strikerX}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
              accentColor: '#4da6ff',
              height: '6px',
              borderRadius: '3px',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.2)'
            }}
          />
        </div>
      )}

      {dragVector && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px 20px',
          borderRadius: '30px',
          fontFamily: 'Outfit, sans-serif',
          pointerEvents: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          🎯 {Math.abs(dragVector.x) > 0.1 ? 'POWERING UP...' : 'AIMING...'}
        </div>
      )}
    </div>
  );
}
