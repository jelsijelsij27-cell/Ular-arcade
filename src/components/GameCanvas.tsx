import React, { useEffect, useRef } from 'react';
import {
  ActivePowerUp,
  Coordinate,
  Direction,
  FloatingText,
  FoodItem,
  LevelConfig,
  Obstacle,
  Particle,
  SnakeSkinId,
} from '../types/game';
import { GRID_SIZE, SKINS } from '../utils/constants';

interface GameCanvasProps {
  snake: Coordinate[];
  direction: Direction;
  food: FoodItem[];
  obstacles: Obstacle[];
  levelConfig?: LevelConfig;
  skinId: SnakeSkinId;
  activePowerUps: ActivePowerUp[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  isGameOver: boolean;
  isPaused: boolean;
  wallPassThrough: boolean;
  onSwipeDirection?: (dir: Direction) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  snake,
  direction,
  food,
  obstacles,
  levelConfig,
  skinId,
  activePowerUps,
  particles,
  floatingTexts,
  isGameOver,
  isPaused,
  wallPassThrough,
  onSwipeDirection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Active skin definition
  const skin = SKINS.find((s) => s.id === skinId) || SKINS[0];
  const isGhostActive = activePowerUps.some((p) => p.type === 'GHOST');
  const isSpeedBoostActive = activePowerUps.some((p) => p.type === 'SPEED_BOOST');
  const isSlowMoActive = activePowerUps.some((p) => p.type === 'SLOW_MO');

  // Touch swipe handling directly on the board
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0 || !onSwipeDirection) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - touchStartRef.current.x;
    const dy = endY - touchStartRef.current.y;
    const minDistance = 24; // minimum swipe distance

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minDistance) {
        onSwipeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(dy) > minDistance) {
        onSwipeDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  // Render loop onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height) || 480;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    const cellSize = size / GRID_SIZE;
    const isNokia = skin.id === 'nokia';

    // 1. Draw Board Background
    if (isNokia) {
      ctx.fillStyle = '#9ca88f'; // Classic Nokia greenish monochrome LCD
      ctx.fillRect(0, 0, size, size);

      // Subtle pixel grid
      ctx.strokeStyle = '#8d9980';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(size, i * cellSize);
        ctx.stroke();
      }
    } else {
      // Modern sleek slate canvas
      const bgGrad = ctx.createLinearGradient(0, 0, size, size);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(1, '#05070c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, size, size);

      // Subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(size, i * cellSize);
        ctx.stroke();
      }

      // Outer border indicators
      ctx.strokeStyle = wallPassThrough
        ? 'rgba(16, 185, 129, 0.25)' // Dotted/subtle green for pass-through
        : 'rgba(239, 68, 68, 0.4)'; // Red warning for solid death walls
      ctx.lineWidth = 3;
      if (wallPassThrough) {
        ctx.setLineDash([8, 8]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.strokeRect(1.5, 1.5, size - 3, size - 3);
      ctx.setLineDash([]);
    }

    // 2. Draw Portals if any
    if (levelConfig?.portals) {
      levelConfig.portals.forEach((p, idx) => {
        const portalColors = idx === 0 ? ['#06b6d4', '#3b82f6'] : ['#a855f7', '#ec4899'];

        const drawPortalCircle = (coord: Coordinate, col1: string, col2: string) => {
          const cx = coord.x * cellSize + cellSize / 2;
          const cy = coord.y * cellSize + cellSize / 2;
          const radius = cellSize * 0.45;

          const portalGrad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
          portalGrad.addColorStop(0, col1);
          portalGrad.addColorStop(1, col2);

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fillStyle = portalGrad;
          ctx.shadowColor = col1;
          ctx.shadowBlur = 10;
          ctx.fill();

          // Swirl ring
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 1.5);
          ctx.stroke();
          ctx.restore();
        };

        drawPortalCircle(p.entry, portalColors[0], portalColors[1]);
        drawPortalCircle(p.exit, portalColors[1], portalColors[0]);
      });
    }

    // 3. Draw Obstacles (Walls)
    obstacles.forEach((obs) => {
      const ox = obs.x * cellSize;
      const oy = obs.y * cellSize;
      const pad = 1.5;

      if (isNokia) {
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(ox + pad, oy + pad, cellSize - pad * 2, cellSize - pad * 2);
      } else {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;

        // Rounded brick block
        const r = 4;
        ctx.beginPath();
        ctx.roundRect(ox + pad, oy + pad, cellSize - pad * 2, cellSize - pad * 2, r);
        ctx.fill();
        ctx.stroke();

        // Inner metallic bevel
        ctx.fillStyle = '#475569';
        ctx.fillRect(ox + pad + 3, oy + pad + 3, cellSize - pad * 2 - 6, 2);
        ctx.restore();
      }
    });

    // 4. Draw Food & Power-ups
    const now = Date.now();
    food.forEach((item) => {
      const fx = item.position.x * cellSize + cellSize / 2;
      const fy = item.position.y * cellSize + cellSize / 2;
      const radius = cellSize * 0.38;

      ctx.save();

      if (item.type === 'NORMAL') {
        if (isNokia) {
          ctx.fillStyle = '#2d3748';
          ctx.beginPath();
          ctx.arc(fx, fy, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Glossy red apple with stem
          const appleGrad = ctx.createRadialGradient(
            fx - radius * 0.3,
            fy - radius * 0.3,
            radius * 0.2,
            fx,
            fy,
            radius
          );
          appleGrad.addColorStop(0, '#f87171');
          appleGrad.addColorStop(0.7, '#dc2626');
          appleGrad.addColorStop(1, '#991b1b');

          ctx.beginPath();
          ctx.arc(fx, fy, radius, 0, Math.PI * 2);
          ctx.fillStyle = appleGrad;
          ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
          ctx.shadowBlur = 8;
          ctx.fill();

          // Green leaf
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.ellipse(fx + 3, fy - radius - 1, 3, 5, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();

          // Specular shine
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(fx - radius * 0.35, fy - radius * 0.35, radius * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (item.type === 'GOLDEN_APPLE') {
        // Shimmering Golden Apple
        const goldGrad = ctx.createRadialGradient(
          fx - radius * 0.2,
          fy - radius * 0.2,
          radius * 0.2,
          fx,
          fy,
          radius
        );
        goldGrad.addColorStop(0, '#fef08a');
        goldGrad.addColorStop(0.6, '#eab308');
        goldGrad.addColorStop(1, '#ca8a04');

        ctx.beginPath();
        ctx.arc(fx, fy, radius * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = goldGrad;
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 14;
        ctx.fill();

        // Pulsing star ring
        const pulse = (Math.sin(now / 150) + 1) * 0.5;
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.4 + pulse * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(fx, fy, radius * (1.2 + pulse * 0.2), 0, Math.PI * 2);
        ctx.stroke();
      } else if (item.type === 'SPEED_BOOST') {
        // Speed Boost: Electric Amber/Cyan Lightning
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(fx, fy, radius, 0, Math.PI * 2);
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Bolt icon
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(cellSize * 0.55)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', fx, fy);
      } else if (item.type === 'SLOW_MO') {
        // Slow Mo: Ice Blue Snowflake
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(fx, fy, radius, 0, Math.PI * 2);
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(cellSize * 0.55)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❄️', fx, fy);
      } else if (item.type === 'GHOST') {
        // Ghost Mode: Purple Phantom
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(fx, fy, radius, 0, Math.PI * 2);
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(cellSize * 0.55)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👻', fx, fy);
      } else if (item.type === 'SHRINK') {
        // Shrink Mint: Green Scissors
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(fx, fy, radius, 0, Math.PI * 2);
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(cellSize * 0.5)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✂️', fx, fy);
      }

      ctx.restore();
    });

    // 5. Draw Snake Body & Head
    if (snake.length > 0) {
      ctx.save();

      // Ghost mode transparency
      if (isGhostActive) {
        ctx.globalAlpha = 0.55;
      }

      const totalSegments = snake.length;

      // Draw from tail to head
      for (let i = totalSegments - 1; i >= 0; i--) {
        const seg = snake[i];
        const segX = seg.x * cellSize;
        const segY = seg.y * cellSize;
        const pad = isNokia ? 1 : 1.5;
        const segmentSize = cellSize - pad * 2;
        const progress = i / Math.max(1, totalSegments - 1); // 0 at head, 1 at tail

        if (isNokia) {
          ctx.fillStyle = '#2d3748';
          ctx.fillRect(segX + pad, segY + pad, segmentSize, segmentSize);
          continue;
        }

        if (i === 0) {
          // --- SNAKE HEAD ---
          const headX = segX + cellSize / 2;
          const headY = segY + cellSize / 2;
          const headRadius = cellSize * 0.46;

          // Head glow
          ctx.shadowColor = skin.glowColor;
          ctx.shadowBlur = isSpeedBoostActive ? 16 : 8;

          ctx.fillStyle = skin.headColor;
          ctx.beginPath();
          ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
          ctx.fill();

          // Expressive Eyes facing movement direction
          let eye1X = headX;
          let eye1Y = headY;
          let eye2X = headX;
          let eye2Y = headY;
          const eyeOffset = headRadius * 0.45;
          const eyeForward = headRadius * 0.35;

          if (direction === 'UP') {
            eye1X = headX - eyeOffset;
            eye2X = headX + eyeOffset;
            eye1Y = headY - eyeForward;
            eye2Y = headY - eyeForward;
          } else if (direction === 'DOWN') {
            eye1X = headX - eyeOffset;
            eye2X = headX + eyeOffset;
            eye1Y = headY + eyeForward;
            eye2Y = headY + eyeForward;
          } else if (direction === 'LEFT') {
            eye1X = headX - eyeForward;
            eye2X = headX - eyeForward;
            eye1Y = headY - eyeOffset;
            eye2Y = headY + eyeOffset;
          } else {
            // RIGHT
            eye1X = headX + eyeForward;
            eye2X = headX + eyeForward;
            eye1Y = headY - eyeOffset;
            eye2Y = headY + eyeOffset;
          }

          // Eye whites
          ctx.fillStyle = skin.eyeColor;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(eye1X, eye1Y, 3.2, 0, Math.PI * 2);
          ctx.arc(eye2X, eye2Y, 3.2, 0, Math.PI * 2);
          ctx.fill();

          // Pupils
          ctx.fillStyle = '#0f172a';
          let pupilDx = 0;
          let pupilDy = 0;
          if (direction === 'UP') pupilDy = -1;
          if (direction === 'DOWN') pupilDy = 1;
          if (direction === 'LEFT') pupilDx = -1;
          if (direction === 'RIGHT') pupilDx = 1;

          ctx.beginPath();
          ctx.arc(eye1X + pupilDx, eye1Y + pupilDy, 1.6, 0, Math.PI * 2);
          ctx.arc(eye2X + pupilDx, eye2Y + pupilDy, 1.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // --- BODY SEGMENT ---
          const radius = i === totalSegments - 1 ? 4 : 6;
          // Interpolate color from body to tail
          ctx.fillStyle = progress > 0.6 ? skin.tailColor : skin.bodyColor;
          ctx.shadowColor = skin.glowColor;
          ctx.shadowBlur = 2;

          ctx.beginPath();
          ctx.roundRect(segX + pad, segY + pad, segmentSize, segmentSize, radius);
          ctx.fill();

          // Subtle center highlight line for sleek texture
          if (i % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.beginPath();
            ctx.arc(segX + cellSize / 2, segY + cellSize / 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    }

    // 6. Draw Particles (Food eating burst)
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 7. Draw Floating Points Text
    floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 6;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    // 8. Draw Paused or Game Over Overlay Banner
    if (isPaused && !isGameOver) {
      ctx.save();
      ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DIJEDA', size / 2, size / 2 - 10);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Tekan SPASI atau tombol Jeda untuk lanjut', size / 2, size / 2 + 18);
      ctx.restore();
    }
  }, [
    snake,
    direction,
    food,
    obstacles,
    levelConfig,
    skin,
    skinId,
    activePowerUps,
    particles,
    floatingTexts,
    isGameOver,
    isPaused,
    wallPassThrough,
    isGhostActive,
    isSpeedBoostActive,
    isSlowMoActive,
  ]);

  return (
    <div
      className="relative w-full max-w-[520px] aspect-square mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl game-viewport flex items-center justify-center p-1 sm:p-2"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-xl cursor-pointer"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
