import { useEffect, useRef, useState } from "react";
import RAPIER from "@dimforge/rapier3d-compat";

let isRapierInitialized = false;

export const usePhysics = () => {
  const worldRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const init = async () => {
      if (!isRapierInitialized) {
        await RAPIER.init();
        isRapierInitialized = true;
      }

      if (!active) return;

      // Reset reference to avoid leakage
      worldRef.current = null;

      // Create a fresh world for this exact component mount
      const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
      worldRef.current = world;
      setIsReady(true);
    };

    init();

    return () => {
      active = false;
      worldRef.current = null;
      setIsReady(false);
    };
  }, []);

  return { worldRef, isReady };
};
