import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

const createStrikerTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  
  const cx = 256, cy = 256;

  // Base White/Cream
  ctx.beginPath();
  ctx.arc(cx, cy, 256, 0, Math.PI * 2);
  ctx.fillStyle = "#f8f9fa";
  ctx.fill();

  // Outer Blue Ring
  ctx.lineWidth = 20;
  ctx.strokeStyle = "#4da6ff";
  ctx.beginPath(); ctx.arc(cx, cy, 230, 0, Math.PI * 2); ctx.stroke();
  
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#0066cc";
  ctx.beginPath(); ctx.arc(cx, cy, 210, 0, Math.PI * 2); ctx.stroke();

  // Starburst
  ctx.save();
  ctx.translate(cx, cy);
  const spikes = 16;
  for(let i = 0; i < spikes; i++) {
      ctx.rotate((Math.PI * 2) / spikes);
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(i % 2 === 0 ? 180 : 120, 0);
      ctx.lineWidth = i % 2 === 0 ? 8 : 4;
      ctx.strokeStyle = i % 2 === 0 ? "#ff9933" : "#0066cc";
      ctx.stroke();
  }
  ctx.restore();

  // Center Orange Dot
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fillStyle = "#ff8c00";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#fff";
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
};

export const createStriker = (scene, world) => {
  const geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);
  
  const materials = [
      new THREE.MeshStandardMaterial({ color: "#d9d9d9" }), // Edge
      new THREE.MeshStandardMaterial({ map: createStrikerTexture(), roughness: 0.3, metalness: 0.2 }), // Top
      new THREE.MeshStandardMaterial({ color: "#d9d9d9" })  // Bottom
  ];

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.position.set(0, 0.075, 2.3);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, 0.075, 2.3)
    .setLinearDamping(1.5)
    .setAngularDamping(1.5)
    .setCcdEnabled(true)
    .enabledTranslations(true, false, true)  // No vertical movement
    .enabledRotations(false, false, false);  // No rotation

  const body = world.createRigidBody(bodyDesc);

  const colliderDesc = RAPIER.ColliderDesc.cylinder(0.025, 0.25)
    .setRestitution(0.15)   // felt-like, low bounce
    .setFriction(0.05);

  world.createCollider(colliderDesc, body);

  return { mesh, body };
};
