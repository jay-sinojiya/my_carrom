// Carrom Bot AI
// Targets the nearest coin to the striker and calculates a smart strike angle.

const POCKETS = [
  { x: -2.8, z: -2.8 },
  { x: 2.8, z: -2.8 },
  { x: -2.8, z: 2.8 },
  { x: 2.8, z: 2.8 },
];

// Find nearest pocket to a coin
const nearestPocket = (coin) => {
  let best = POCKETS[0];
  let minDist = Infinity;
  POCKETS.forEach((p) => {
    const d = Math.sqrt((coin.x - p.x) ** 2 + (coin.z - p.z) ** 2);
    if (d < minDist) { minDist = d; best = p; }
  });
  return best;
};

/**
 * Calculate best bot strike vector.
 * @param {Object} striker       - { x, z } from body.translation()
 * @param {Object[]} coins       - Array of { x, z } from each coin body.translation()
 * @param {"easy"|"medium"|"hard"} difficulty
 * @returns {{ angle: number, force: number } | null}
 */
export const getBotMove = (striker, coins, difficulty = "medium") => {
  if (!coins.length) return null;

  // Difficulty config
  let randomness, powerFactor, missChance;
  switch (difficulty) {
    case "easy":
      randomness = 0.5;
      powerFactor = 0.6;
      missChance = 0.2; // 20% chance of intentionally missing
      break;
    case "hard":
      randomness = 0.04;
      powerFactor = 1.0;
      missChance = 0;
      break;
    default: // medium
      randomness = 0.2;
      powerFactor = 0.8;
      missChance = 0.08;
  }

  // Occasional intentional miss (makes bot feel human)
  if (Math.random() < missChance) {
    const randomAngle = Math.random() * Math.PI * 2;
    return { angle: randomAngle, force: 0.5 + Math.random() * 0.5 };
  }

  // Pick nearest coin to striker
  let target = coins[0];
  let minDist = Infinity;
  coins.forEach((coin) => {
    const dx = coin.x - striker.x;
    const dz = coin.z - striker.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < minDist) { minDist = dist; target = coin; }
  });

  // In "hard" mode: aim specifically toward the nearest pocket for that coin
  // In other modes: aim directly at the coin
  let aimTarget = target;
  if (difficulty === "hard") {
    aimTarget = nearestPocket(target);
    // Aim through the coin toward the pocket (simple billiards approach)
    // Direction from pocket, through coin, and compute the strike line toward the coin
    const pdx = target.x - aimTarget.x;
    const pdz = target.z - aimTarget.z;
    const pMag = Math.sqrt(pdx * pdx + pdz * pdz);
    aimTarget = {
      x: target.x + (pdx / pMag) * 0.4,
      z: target.z + (pdz / pMag) * 0.4,
    };
  }

  const dx = aimTarget.x - striker.x;
  const dz = aimTarget.z - striker.z;

  let angle = Math.atan2(dz, dx);

  // Add human-like randomness
  angle += (Math.random() - 0.5) * randomness;

  // Adjust strike force based on distance + difficulty
  const force = Math.min(minDist * powerFactor, 2.0);

  return { angle, force };
};
