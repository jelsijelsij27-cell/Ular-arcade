export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameMode = 'CLASSIC' | 'CAMPAIGN' | 'TIME_ATTACK' | 'OBSTACLES';

export type SpeedLevel = 'SLOW' | 'NORMAL' | 'FAST' | 'EXTREME';

export type SnakeSkinId = 'emerald' | 'cyberpunk' | 'amber' | 'amethyst' | 'nokia';

export type PowerUpType = 'GOLDEN_APPLE' | 'SPEED_BOOST' | 'SLOW_MO' | 'GHOST' | 'SHRINK';

export interface Coordinate {
  x: number;
  y: number;
}

export interface FoodItem {
  position: Coordinate;
  type: 'NORMAL' | PowerUpType;
  points: number;
  expiresAt?: number; // timestamp
}

export interface Obstacle {
  x: number;
  y: number;
  type: 'WALL' | 'PORTAL_A' | 'PORTAL_B';
  targetPortal?: Coordinate;
}

export interface ActivePowerUp {
  type: PowerUpType;
  duration: number; // in seconds
  remainingTime: number; // in seconds
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface GameStats {
  gamesPlayed: number;
  totalApplesEaten: number;
  longestSnake: number;
  highScoreClassic: number;
  highScoreCampaign: number;
  highScoreTimeAttack: number;
  highScoreObstacles: number;
  powerUpsCollected: number;
}

export interface SkinDefinition {
  id: SnakeSkinId;
  name: string;
  headColor: string;
  bodyColor: string;
  tailColor: string;
  eyeColor: string;
  glowColor: string;
  patternType: 'solid' | 'gradient' | 'striped' | 'retro';
}

export interface LevelConfig {
  levelNumber: number;
  title: string;
  description: string;
  targetApples: number;
  speed: SpeedLevel;
  obstacles: Coordinate[];
  portals?: { entry: Coordinate; exit: Coordinate }[];
}
