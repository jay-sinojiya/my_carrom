import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function AimLine({ scene, strikerMesh, dragVector }) {
  const lineRef = useRef();

  useEffect(() => {
    if (!scene) return;
    const material = new THREE.LineBasicMaterial({ 
        color: 0xffff00, // Yellow as requested
        linewidth: 3,
        transparent: true,
        opacity: 0.8
    });

    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0) // Extra point for a small "arrow" head maybe? Simplified for now.
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    lineRef.current = line;

    return () => {
      scene.remove(line);
    };
  }, [scene]);

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      if (!lineRef.current) return;

      if (!dragVector) {
        lineRef.current.visible = false;
      } else {
        lineRef.current.visible = true;
        const start = strikerMesh ? strikerMesh.position.clone() : new THREE.Vector3(0, 0.075, 2.3);
        start.y = 0.08;

        // dragVector.x, y are the cos/sin * power * 0.5
        // We want the line to show the trajectory
        const end = new THREE.Vector3(
          start.x + dragVector.x * 2, // Scale for visibility
          start.y,
          start.z + dragVector.y * 2
        );

        lineRef.current.geometry.setFromPoints([start, end]);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [strikerMesh, dragVector]);

  return null;
}
