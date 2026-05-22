import { useEffect, useRef } from "react";
import { useGameStore } from "../../store/gameStore";
import { useProStrike } from "../../hooks/useProStrike";

export default function AimController({ strikerBody, setDragVector, onStrike }) {
  const { onDown, onMove, onUp } = useProStrike(strikerBody, onStrike, setDragVector);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const handleDown = (e) => {
      const { playerTurn, playerId } = useGameStore.getState();
      if (playerTurn !== playerId) return;
      
      if (strikerBody) {
        const vel = strikerBody.linvel();
        if (Math.abs(vel.x) + Math.abs(vel.z) > 0.05) return;
      }
      
      onDown(getMousePos(e));
    };

    const handleMove = (e) => {
      onMove(getMousePos(e));
    };

    const handleUp = () => {
      onUp();
    };

    canvas.addEventListener("mousedown", handleDown);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    canvas.addEventListener("touchstart", handleDown, { passive: false });
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      canvas.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      canvas.removeEventListener("touchstart", handleDown);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [onDown, onMove, onUp]);

  return null;
}

const strike = (body, force, angle) => {
  if (!body) return;
  const x = Math.cos(angle) * force;
  const z = Math.sin(angle) * force;

  body.applyImpulse({ x, y: 0, z }, true);
};
