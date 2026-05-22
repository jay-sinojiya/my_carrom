import { useRef, useCallback } from "react";
import * as THREE from "three";

export const useThreeScene = () => {
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animIdRef = useRef(null);
  const lightsRef = useRef([]);

  // Use a ref-callback instead of mountRef + useEffect to avoid StrictMode double-init
  const mountRef = useCallback((node) => {
    if (node) {
      // --- MOUNT ---
      const scene = sceneRef.current;
      scene.background = new THREE.Color("#1a1a1a");

      const w = node.clientWidth || window.innerWidth || 800;
      const h = node.clientHeight || window.innerHeight || 600;
      console.log("[ThreeScene] Mounting. Dimensions:", w, "x", h);

      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
      camera.position.set(0, 10, 10);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;

      // Ensure CSS does not hide the canvas
      renderer.domElement.style.display = "block";
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      node.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      console.log("[ThreeScene] Canvas appended:", renderer.domElement.width, "x", renderer.domElement.height);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(5, 10, 5);
      dirLight.castShadow = true;
      scene.add(ambientLight);
      scene.add(dirLight);
      lightsRef.current = [ambientLight, dirLight];

      // Resize handler
      const onResize = () => {
        const w = node.clientWidth || window.innerWidth;
        const h = node.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);
      node._onResize = onResize;

      // Render loop
      const animate = () => {
        animIdRef.current = requestAnimationFrame(animate);
        renderer.render(scene, cameraRef.current);
      };
      animate();

    } else {
      // --- UNMOUNT ---
      console.log("[ThreeScene] Unmounting.");
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
        animIdRef.current = null;
      }

      // Remove lights to avoid context leaks
      for (const light of lightsRef.current) {
        sceneRef.current.remove(light);
      }
      lightsRef.current = [];

      if (rendererRef.current) {
        const canvas = rendererRef.current.domElement;
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    }
  }, []); // empty deps — only runs once per DOM node

  return { mountRef, sceneRef };
};
