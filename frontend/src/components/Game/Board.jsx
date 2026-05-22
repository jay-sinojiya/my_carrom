import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

const createBoardTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // 1. Wood Base (Gradient)
  const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 800);
  grad.addColorStop(0, "#e8d2a6"); // Lighter center
  grad.addColorStop(1, "#c59f60"); // Darker edges
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Helper bindings
  const cx = 512, cy = 512;
  const outerBox = 800; // Size of the outer striking line box
  const innerBox = 720; // Size of the inner striking line box
  const cornerRadius = 60; // Radius of corner base circles

  // 2. Center Circles
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#333";
  
  // Center Red Ring
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#e63946";
  ctx.fill();
  ctx.stroke();

  // Outer Center Ring
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.stroke();

  // Pattern lines in center (optional star pattern)
  ctx.save();
  ctx.translate(cx, cy);
  for(let i=0; i<8; i++) {
     ctx.rotate(Math.PI / 4);
     ctx.beginPath();
     ctx.moveTo(30, 0);
     ctx.lineTo(120, 0);
     ctx.stroke();
  }
  ctx.restore();

  // 3. Striking Lines (The square border)
  const drawStrikingLines = () => {
      const offset = (1024 - outerBox) / 2;
      const innerOffset = (1024 - innerBox) / 2;
      
      ctx.beginPath();
      // Outer box
      ctx.rect(offset, offset, outerBox, outerBox);
      // Inner box
      ctx.rect(innerOffset, innerOffset, innerBox, innerBox);
      ctx.stroke();
      
      // Fill the gap between lines with a slightly darker wood tone
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fill("evenodd");
  };
  drawStrikingLines();

  // 4. Corner Base Circles (Red/Black)
  const drawCornerCircle = (x, y) => {
      // Outer
      ctx.beginPath();
      ctx.arc(x, y, cornerRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#c59f60";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inner Red
      ctx.beginPath();
      ctx.arc(x, y, cornerRadius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = "#e63946"; // Premium red
      ctx.fill();
      ctx.stroke();
  };

  const offset = (1024 - outerBox) / 2;
  drawCornerCircle(offset, offset); // TL
  drawCornerCircle(1024 - offset, offset); // TR
  drawCornerCircle(offset, 1024 - offset); // BL
  drawCornerCircle(1024 - offset, 1024 - offset); // BR

  // 5. Diagonal Lines to Pockets
  ctx.beginPath();
  ctx.moveTo(offset, offset); ctx.lineTo(offset - 80, offset - 80);
  ctx.moveTo(1024 - offset, offset); ctx.lineTo(1024 - offset + 80, offset - 80);
  ctx.moveTo(offset, 1024 - offset); ctx.lineTo(offset - 80, 1024 - offset + 80);
  ctx.moveTo(1024 - offset, 1024 - offset); ctx.lineTo(1024 - offset + 80, 1024 - offset + 80);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16; // Polish quality
  return texture;
};

export const createBoard = (scene, world) => {
  // Main Board Floor
  const floorGeometry = new THREE.PlaneGeometry(6, 6);
  const floorMaterial = new THREE.MeshBasicMaterial({ 
      color: "#e8d2a6", // Wood color fallback
      map: createBoardTexture(),
      wireframe: false
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Physics (floor)
  const floorBodyDesc = RAPIER.RigidBodyDesc.fixed();
  const floorBody = world.createRigidBody(floorBodyDesc);
  const floorColliderDesc = RAPIER.ColliderDesc.cuboid(3, 0.05, 3)
    .setRestitution(0.1)
    .setFriction(0.6);
  world.createCollider(floorColliderDesc, floorBody);

  // Board Boundaries
  const wallThickness = 0.2;   // VISUAL thickness
  const physWall = 2.0;        // PHYSICS thickness (fat = no tunneling)
  const wallHeight = 0.4;
  const boardSize = 6;
  const half = boardSize / 2;  // 3.0

  const walls = [
    // [visual pos, visual size, physics pos, physics half-extents]
    { // Bottom (+Z)
      pos:  [0, wallHeight / 2, half + wallThickness / 2],
      size: [boardSize + wallThickness * 2, wallHeight, wallThickness],
      ppos: [0, wallHeight / 2, half + physWall / 2],
      phalf: [half + physWall, 5.0, physWall / 2],
    },
    { // Top (-Z)
      pos:  [0, wallHeight / 2, -half - wallThickness / 2],
      size: [boardSize + wallThickness * 2, wallHeight, wallThickness],
      ppos: [0, wallHeight / 2, -half - physWall / 2],
      phalf: [half + physWall, 5.0, physWall / 2],
    },
    { // Right (+X)
      pos:  [half + wallThickness / 2, wallHeight / 2, 0],
      size: [wallThickness, wallHeight, boardSize],
      ppos: [half + physWall / 2, wallHeight / 2, 0],
      phalf: [physWall / 2, 5.0, half + physWall],
    },
    { // Left (-X)
      pos:  [-half - wallThickness / 2, wallHeight / 2, 0],
      size: [wallThickness, wallHeight, boardSize],
      ppos: [-half - physWall / 2, wallHeight / 2, 0],
      phalf: [physWall / 2, 5.0, half + physWall],
    },
  ];

  walls.forEach(({ pos, size, ppos, phalf }) => {
    // Visual mesh (thin)
    const wallGeometry = new THREE.BoxGeometry(...size);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: "#4a3525",
        roughness: 0.6
    });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(...pos);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // Physics (fat slab — impossible to tunnel through)
    const wallBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(...ppos);
    const wallBody = world.createRigidBody(wallBodyDesc);
    const wallColliderDesc = RAPIER.ColliderDesc.cuboid(...phalf)
      .setRestitution(0.4)
      .setFriction(0.2);
    world.createCollider(wallColliderDesc, wallBody);
  });


  // Create Pockets
  createPockets(scene);

  return floor;
};

export const createPockets = (scene) => {
  const geometry = new THREE.CircleGeometry(0.35, 32);
  const material = new THREE.MeshBasicMaterial({ color: "#000000" });

  const positions = [
    [-2.8, -2.8],
    [2.8, -2.8],
    [-2.8, 2.8],
    [2.8, 2.8],
  ];

  positions.forEach(([x, z]) => {
    // Outer shadow ring
    const shadowGeo = new THREE.CircleGeometry(0.38, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: "#1a1a1a" });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(x, 0.009, z);
    scene.add(shadow);

    // Inner deep pocket
    const pocket = new THREE.Mesh(geometry, material);
    pocket.rotation.x = -Math.PI / 2;
    pocket.position.set(x, 0.01, z); // Slightly above floor to avoid z-fighting
    scene.add(pocket);
  });
};
