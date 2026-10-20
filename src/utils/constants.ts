import { Coordinate, LevelConfig, SkinDefinition, SpeedLevel } from '../types/game';

export const GRID_SIZE = 22; // 22 x 22 cells
export const CELL_PIXEL_SIZE = 26; // on standard render

export const SPEED_MS: Record<SpeedLevel, number> = {
  SLOW: 145,
  NORMAL: 105,
  FAST: 75,
  EXTREME: 50,
};

export const SKINS: SkinDefinition[] = [
  {
    id: 'emerald',
    name: 'Hijau Zamrud Klasik',
    headColor: '#10B981',
    bodyColor: '#059669',
    tailColor: '#047857',
    eyeColor: '#F8FAFC',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    patternType: 'gradient',
  },
  {
    id: 'cyberpunk',
    name: 'Siberpunk Elektrik',
    headColor: '#06B6D4',
    bodyColor: '#3B82F6',
    tailColor: '#8B5CF6',
    eyeColor: '#FDF4FF',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    patternType: 'gradient',
  },
  {
    id: 'amber',
    name: 'Kobra Emas Murni',
    headColor: '#F59E0B',
    bodyColor: '#D97706',
    tailColor: '#B45309',
    eyeColor: '#1E293B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    patternType: 'gradient',
  },
  {
    id: 'amethyst',
    name: 'Ametis Kosmis',
    headColor: '#A855F7',
    bodyColor: '#9333EA',
    tailColor: '#7E22CE',
    eyeColor: '#FDF2F8',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    patternType: 'gradient',
  },
  {
    id: 'nokia',
    name: 'Retro 1997 Monokrom',
    headColor: '#2D3748',
    bodyColor: '#4A5568',
    tailColor: '#718096',
    eyeColor: '#E2E8F0',
    glowColor: 'rgba(74, 85, 104, 0.3)',
    patternType: 'retro',
  },
];

export const CAMPAIGN_LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    title: 'Tahap 1: Padang Rumput Tenang',
    description: 'Santai dan kuasai kontrol dasar. Tanpa rintangan dinding tambahan.',
    targetApples: 8,
    speed: 'SLOW',
    obstacles: [],
  },
  {
    levelNumber: 2,
    title: 'Tahap 2: Pilar Batu Sudut',
    description: 'Batu pilar menghadang di empat penjuru arena.',
    targetApples: 10,
    speed: 'NORMAL',
    obstacles: [
      { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 4 },
      { x: 17, y: 4 }, { x: 17, y: 5 }, { x: 16, y: 4 },
      { x: 4, y: 17 }, { x: 4, y: 16 }, { x: 5, y: 17 },
      { x: 17, y: 17 }, { x: 17, y: 16 }, { x: 16, y: 17 },
    ],
  },
  {
    levelNumber: 3,
    title: 'Tahap 3: Labirin Salib Sentral',
    description: 'Dinding berbentuk salib di tengah arena membagi ruang gerak.',
    targetApples: 12,
    speed: 'NORMAL',
    obstacles: [
      { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 },
      { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 },
      { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 16 },
      { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 },
      { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 7, y: 10 },
      { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 },
      { x: 14, y: 10 }, { x: 15, y: 10 }, { x: 16, y: 10 },
      { x: 14, y: 11 }, { x: 15, y: 11 }, { x: 16, y: 11 },
    ],
  },
  {
    levelNumber: 4,
    title: 'Tahap 4: Portal Dua Dimensi',
    description: 'Gunakan portal magis ungu untuk berpindah instan antar sisi!',
    targetApples: 14,
    speed: 'FAST',
    obstacles: [
      { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 },
      { x: 18, y: 10 }, { x: 18, y: 11 }, { x: 18, y: 12 },
    ],
    portals: [
      { entry: { x: 5, y: 5 }, exit: { x: 16, y: 16 } },
      { entry: { x: 16, y: 5 }, exit: { x: 5, y: 16 } },
    ],
  },
  {
    levelNumber: 5,
    title: 'Tahap 5: Benteng Sang Juara',
    description: 'Kecepatan ekstra dan koridor sempit. Kumpulkan 16 buah untuk memenangkan trofi!',
    targetApples: 16,
    speed: 'FAST',
    obstacles: [
      { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 12, y: 7 }, { x: 13, y: 7 }, { x: 14, y: 7 },
      { x: 7, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }, { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 },
      { x: 7, y: 8 }, { x: 7, y: 13 },
      { x: 14, y: 8 }, { x: 14, y: 13 },
    ],
  },
];

// Fixed obstacles for Obstacle Blitz mode
export const OBSTACLE_BLITZ_MAP: Coordinate[] = [
  { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 },
  { x: 16, y: 5 }, { x: 15, y: 5 }, { x: 16, y: 6 },
  { x: 5, y: 16 }, { x: 6, y: 16 }, { x: 5, y: 15 },
  { x: 16, y: 16 }, { x: 15, y: 16 }, { x: 16, y: 15 },
  { x: 10, y: 9 }, { x: 11, y: 9 }, { x: 10, y: 12 }, { x: 11, y: 12 },
];
