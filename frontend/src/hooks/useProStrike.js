import { useRef, useState, useCallback } from "react";

export const useProStrike = (strikerBody, onStrike, setDragVector) => {
  const [aimAngle, setAimAngle] = useState(0);
  const [power, setPower] = useState(0);
  const [isAiming, setIsAiming] = useState(false);

  // Use refs for values that onUp needs to access without causing re-renders
  const aimAngleRef = useRef(0);
  const powerRef = useRef(0);
  const startPos = useRef({ x: 0, y: 0 });
  const isAimingRef = useRef(false);
  
  const MAX_POWER = 8;
  const POWER_MULTIPLIER = 0.8;

  const onDown = useCallback((pos) => {
    isAimingRef.current = true;
    setIsAiming(true);
    startPos.current = pos;
  }, []);

  const onMove = useCallback((pos) => {
    if (!isAimingRef.current) return;
    
    const dx = startPos.current.x - pos.x;
    const dy = startPos.current.y - pos.y;
    
    const angle = Math.atan2(-dy, dx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const calculatedPower = Math.min(dist * 10 * POWER_MULTIPLIER, MAX_POWER);

    // Update state for UI (AimLine/PowerBar)
    setAimAngle(angle);
    setPower(calculatedPower);

    // Update refs for onUp capture
    aimAngleRef.current = angle;
    powerRef.current = calculatedPower;

    // Sync visual line immediately
    if (setDragVector) {
      setDragVector({ 
        x: Math.cos(angle) * calculatedPower * 0.5, 
        y: Math.sin(angle) * calculatedPower * 0.5 
      });
    }
  }, [setDragVector]);

  const onUp = useCallback(() => {
    if (!isAimingRef.current) return;
    isAimingRef.current = false;
    setIsAiming(false);

    // Use the latest values captured in refs
    const finalPower = powerRef.current;
    const finalAngle = aimAngleRef.current;

    if (finalPower > 0.2) {
      if (strikerBody) {
        strikerBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        const impulse = {
          x: Math.cos(finalAngle) * finalPower,
          y: 0,
          z: Math.sin(finalAngle) * finalPower
        };
        strikerBody.applyImpulse(impulse, true);
        if (onStrike) onStrike(finalPower, finalAngle);
      }
    }

    // Reset values
    if (setDragVector) setDragVector(null);
    setPower(0);
  }, [strikerBody, onStrike, setDragVector]);

  return {
    onDown,
    onMove,
    onUp,
    aimAngle,
    power,
    isAiming
  };
};
