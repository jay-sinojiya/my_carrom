import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

const createCoinTexture = (colorType) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  
  const cx = 128, cy = 128;
  
  // Base Color
  let baseColor, ringColor, centerColor;
  if (colorType === "white") {
      baseColor = "#f0f0f0";
      ringColor = "#cccccc";
      centerColor = "#ffffff";
  } else if (colorType === "red") {
      baseColor = "#e63946";
      ringColor = "#a81d27";
      centerColor = "#ff4d4d";
  } else {
      // Black
      baseColor = "#2b2b2b";
      ringColor = "#111111";
      centerColor = "#444444";
  }

  // Fill base
  ctx.beginPath();
  ctx.arc(cx, cy, 128, 0, Math.PI * 2);
  ctx.fillStyle = baseColor;
  ctx.fill();

  // Add concentric grooves (carrom men style)
  ctx.lineWidth = 4;
  ctx.strokeStyle = ringColor;
  
  ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.stroke();

  // Inner center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fillStyle = centerColor;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
};

export const createCoin = (scene, world, x, z, color = "black") => {
  // Three.js mesh
  const geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
  
  const materials = [
      new THREE.MeshStandardMaterial({ color: color === "white" ? "#cccccc" : (color === "red" ? "#a81d27" : "#111111") }), // Edge
      new THREE.MeshStandardMaterial({ map: createCoinTexture(color), roughness: 0.5, metalness: 0.1 }), // Top
      new THREE.MeshStandardMaterial({ color: color === "white" ? "#cccccc" : (color === "red" ? "#a81d27" : "#111111") })  // Bottom
  ];

  const mesh = new THREE.Mesh(geometry, materials);

  mesh.position.set(x, 0.075, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Physics body
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(x, 0.075, z)
    .setLinearDamping(1.5)
    .setAngularDamping(1.5)
    .setCcdEnabled(true)
    .enabledTranslations(true, false, true)  // No vertical movement
    .enabledRotations(false, false, false);  // No rotation at all

  const body = world.createRigidBody(bodyDesc);

  const colliderDesc = RAPIER.ColliderDesc.cylinder(0.025, 0.2)
    .setRestitution(0.15)   // felt-like, low bounce
    .setFriction(0.05);

  world.createCollider(colliderDesc, body);

  return { mesh, body };
};
