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

      // Free previous world if it existed but was leaked
      if (worldRef.current) {
         try { worldRef.current.free(); } catch(e){}
      }

      // Create a fresh world for this exact component mount
      const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
      worldRef.current = world;
      setIsReady(true);
    };

    init();

    return () => {
      active = false;
      if (worldRef.current) {
        // Correctly free the WASM physics memory to avoid unreachable panics
        try { worldRef.current.free(); } catch(e){}
        worldRef.current = null;
      }
      setIsReady(false);
    };
  }, []);

  return { worldRef, isReady };
};
