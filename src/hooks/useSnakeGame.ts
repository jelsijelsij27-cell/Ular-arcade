import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActivePowerUp,
  Coordinate,
  Direction,
  FloatingText,
  FoodItem,
  GameMode,
  GameStats,
  LevelConfig,
  Obstacle,
  Particle,
  PowerUpType,
  SnakeSkinId,
  SpeedLevel,
} from '../types/game';
import { soundManager } from '../utils/audio';
import {
  CAMPAIGN_LEVELS,
  GRID_SIZE,
  OBSTACLE_BLITZ_MAP,
  SPEED_MS,
} from '../utils/constants';

const INITIAL_SNAKE: Coordinate[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  totalApplesEaten: 0,
  longestSnake: 3,
  highScoreClassic: 0,
  highScoreCampaign: 0,
  highScoreTimeAttack: 0,
  highScoreObstacles: 0,
  powerUpsCollected: 0,
};

export const useSnakeGame = () => {
  // Game Configuration State
  const [mode, setMode] = useState<GameMode>('CLASSIC');
  const [speedLevel, setSpeedLevel] = useState<SpeedLevel>('NORMAL');
  const [wallPassThrough, setWallPassThrough] = useState<boolean>(false);
  const [skinId, setSkinId] = useState<SnakeSkinId>('emerald');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getIsMuted());
  const [volume, setVolume] = useState<number>(() => soundManager.getVolume());

  // Campaign specific state
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const currentCampaignLevel: LevelConfig | undefined =
    mode === 'CAMPAIGN' ? CAMPAIGN_LEVELS[currentLevelIndex] : undefined;
  const [applesEatenInLevel, setApplesEatenInLevel] = useState<number>(0);

  // Time Attack specific state
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  // Active Play State
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<FoodItem[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Score & Status State
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Stats State from localStorage
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('snake_game_stats');
    if (saved) {
      try {
        return { ...DEFAULT_STATS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  // Mutable refs to prevent closure stale states in game loop
  const nextDirectionRef = useRef<Direction>('UP');
  const lastTickTimeRef = useRef<number>(0);
  const lastSecondTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const scoreRef = useRef<number>(0);
  scoreRef.current = score;

  // Save stats helper
  const updateStats = useCallback((updater: (prev: GameStats) => GameStats) => {
    setStats((prev) => {
      const updated = updater(prev);
      localStorage.setItem('snake_game_stats', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get high score for active mode
  const getHighScoreForMode = useCallback(
    (currentMode: GameMode): number => {
      switch (currentMode) {
        case 'CLASSIC':
          return stats.highScoreClassic;
        case 'CAMPAIGN':
          return stats.highScoreCampaign;
        case 'TIME_ATTACK':
          return stats.highScoreTimeAttack;
        case 'OBSTACLES':
          return stats.highScoreObstacles;
        default:
          return 0;
      }
    },
    [stats]
  );

  // Helper to spawn items at unoccupied coordinate
  const getRandomFreeCoordinate = useCallback(
    (
      currentSnake: Coordinate[],
      currentObstacles: Obstacle[],
      currentFood: FoodItem[]
    ): Coordinate => {
      let candidate: Coordinate;
      let isColliding = true;
      let attempts = 0;

      while (isColliding && attempts < 200) {
        attempts++;
        candidate = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };

        const onSnake = currentSnake.some((seg) => seg.x === candidate.x && seg.y === candidate.y);
        const onObstacle = currentObstacles.some((obs) => obs.x === candidate.x && obs.y === candidate.y);
        const onFood = currentFood.some(
          (f) => f.position.x === candidate.x && f.position.y === candidate.y
        );

        if (!onSnake && !onObstacle && !onFood) {
          return candidate;
        }
      }

      return { x: 5, y: 5 };
    },
    []
  );

  // Particle emission helper
  const spawnParticles = useCallback((coord: Coordinate, color: string, count = 12) => {
    const cellSize = 480 / GRID_SIZE;
    const px = coord.x * cellSize + cellSize / 2;
    const py = coord.y * cellSize + cellSize / 2;

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3.5;
      newParticles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color,
        alpha: 1,
        decay: 0.035 + Math.random() * 0.02,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Floating text helper
  const addFloatingText = useCallback((coord: Coordinate, text: string, color: string) => {
    const cellSize = 480 / GRID_SIZE;
    const px = coord.x * cellSize + cellSize / 2;
    const py = coord.y * cellSize + cellSize / 2;

    setFloatingTexts((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        x: px,
        y: py,
        text,
        color,
        alpha: 1,
        vy: -1.2,
      },
    ]);
  }, []);

  // Initialize obstacles based on mode
  const setupObstacles = useCallback(
    (gameMode: GameMode, levelIdx = 0): Obstacle[] => {
      if (gameMode === 'OBSTACLES') {
        return OBSTACLE_BLITZ_MAP.map((c) => ({ x: c.x, y: c.y, type: 'WALL' }));
      }
      if (gameMode === 'CAMPAIGN') {
        const lvl = CAMPAIGN_LEVELS[levelIdx];
        if (!lvl) return [];
        const walls: Obstacle[] = lvl.obstacles.map((c) => ({ x: c.x, y: c.y, type: 'WALL' }));
        return walls;
      }
      return [];
    },
    []
  );

  // Reset or start a new game
  const resetGame = useCallback(
    (newMode = mode, levelIdx = currentLevelIndex) => {
      const initialSnake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
      ];
      setSnake(initialSnake);
      setDirection('UP');
      nextDirectionRef.current = 'UP';
      setIsPaused(false);
      setIsGameOver(false);
      setIsVictory(false);
      setIsNewHighScore(false);
      setScore(0);
      setActivePowerUps([]);
      setParticles([]);
      setFloatingTexts([]);
      setApplesEatenInLevel(0);
      setTimeRemaining(60);

      const newObstacles = setupObstacles(newMode, levelIdx);
      setObstacles(newObstacles);

      // Initial food
      const initialFoodPos = { x: 10, y: 5 };
      setFood([
        {
          position: initialFoodPos,
          type: 'NORMAL',
          points: 10,
        },
      ]);

      lastTickTimeRef.current = performance.now();
      lastSecondTimeRef.current = performance.now();

      updateStats((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
      }));
    },
    [mode, currentLevelIndex, setupObstacles, updateStats]
  );

  // Direction changer with 180-degree reversal prevention
  const changeDirection = useCallback(
    (newDir: Direction) => {
      if (isPaused || isGameOver) return;

      const current = direction;
      const invalid =
        (newDir === 'UP' && current === 'DOWN') ||
        (newDir === 'DOWN' && current === 'UP') ||
        (newDir === 'LEFT' && current === 'RIGHT') ||
        (newDir === 'RIGHT' && current === 'LEFT');

      if (!invalid && newDir !== current) {
        nextDirectionRef.current = newDir;
        soundManager.playTurn();
      }
    },
    [direction, isPaused, isGameOver]
  );

  // Toggle pause
  const togglePause = useCallback(() => {
    if (isGameOver) return;
    setIsPaused((prev) => !prev);
    soundManager.playClick();
  }, [isGameOver]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
    soundManager.playGameOver();

    const currentScore = scoreRef.current;
    const currentHigh = getHighScoreForMode(mode);
    const isNewBest = currentScore > currentHigh;

    if (isNewBest) {
      setIsNewHighScore(true);
    }

    updateStats((prev) => {
      let highClassic = prev.highScoreClassic;
      let highCampaign = prev.highScoreCampaign;
      let highTime = prev.highScoreTimeAttack;
      let highObstacles = prev.highScoreObstacles;

      if (mode === 'CLASSIC' && currentScore > highClassic) highClassic = currentScore;
      if (mode === 'CAMPAIGN' && currentScore > highCampaign) highCampaign = currentScore;
      if (mode === 'TIME_ATTACK' && currentScore > highTime) highTime = currentScore;
      if (mode === 'OBSTACLES' && currentScore > highObstacles) highObstacles = currentScore;

      return {
        ...prev,
        highScoreClassic: highClassic,
        highScoreCampaign: highCampaign,
        highScoreTimeAttack: highTime,
        highScoreObstacles: highObstacles,
        longestSnake: Math.max(prev.longestSnake, snake.length),
      };
    });
  }, [mode, getHighScoreForMode, updateStats, snake.length]);

  // Audio toggles
  const toggleMute = useCallback(() => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  }, []);

  const changeVolume = useCallback((val: number) => {
    soundManager.setVolume(val);
    setVolume(val);
  }, []);

  // Next level in campaign
  const advanceToNextCampaignLevel = useCallback(() => {
    if (currentLevelIndex < CAMPAIGN_LEVELS.length - 1) {
      const nextIdx = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIdx);
      resetGame('CAMPAIGN', nextIdx);
    }
  }, [currentLevelIndex, resetGame]);

  // Main simulation tick
  const gameTick = useCallback(() => {
    if (isPaused || isGameOver || isVictory) return;

    const currentDir = nextDirectionRef.current;
    setDirection(currentDir);

    const isGhostActive = activePowerUps.some((p) => p.type === 'GHOST');
    const isSpeedBoost = activePowerUps.some((p) => p.type === 'SPEED_BOOST');
    const pointMultiplier = isSpeedBoost ? 2 : 1;

    setSnake((prevSnake) => {
      if (prevSnake.length === 0) return prevSnake;
      const head = prevSnake[0];
      let newHeadX = head.x;
      let newHeadY = head.y;

      if (currentDir === 'UP') newHeadY -= 1;
      if (currentDir === 'DOWN') newHeadY += 1;
      if (currentDir === 'LEFT') newHeadX -= 1;
      if (currentDir === 'RIGHT') newHeadX += 1;

      // Handle Wall Collision / Pass-through
      if (wallPassThrough) {
        newHeadX = (newHeadX + GRID_SIZE) % GRID_SIZE;
        newHeadY = (newHeadY + GRID_SIZE) % GRID_SIZE;
      } else {
        if (newHeadX < 0 || newHeadX >= GRID_SIZE || newHeadY < 0 || newHeadY >= GRID_SIZE) {
          if (!isGhostActive) {
            handleGameOver();
            return prevSnake;
          } else {
            // In ghost mode, wrap safely
            newHeadX = (newHeadX + GRID_SIZE) % GRID_SIZE;
            newHeadY = (newHeadY + GRID_SIZE) % GRID_SIZE;
          }
        }
      }

      // Check Portal Teleportation
      if (mode === 'CAMPAIGN' && currentCampaignLevel?.portals) {
        for (const portal of currentCampaignLevel.portals) {
          if (newHeadX === portal.entry.x && newHeadY === portal.entry.y) {
            newHeadX = portal.exit.x;
            newHeadY = portal.exit.y;
            soundManager.playPortal();
            spawnParticles({ x: newHeadX, y: newHeadY }, '#06b6d4', 16);
            break;
          } else if (newHeadX === portal.exit.x && newHeadY === portal.exit.y) {
            newHeadX = portal.entry.x;
            newHeadY = portal.entry.y;
            soundManager.playPortal();
            spawnParticles({ x: newHeadX, y: newHeadY }, '#a855f7', 16);
            break;
          }
        }
      }

      // Check Obstacle Wall Collision
      const hitObstacle = obstacles.some((obs) => obs.x === newHeadX && obs.y === newHeadY);
      if (hitObstacle && !isGhostActive) {
        handleGameOver();
        return prevSnake;
      }

      // Check Self Collision
      const hitSelf = prevSnake.slice(1).some((seg) => seg.x === newHeadX && seg.y === newHeadY);
      if (hitSelf && !isGhostActive) {
        handleGameOver();
        return prevSnake;
      }

      const newHead: Coordinate = { x: newHeadX, y: newHeadY };

      // Check Food Collision
      const eatenFoodIndex = food.findIndex(
        (f) => f.position.x === newHeadX && f.position.y === newHeadY
      );

      if (eatenFoodIndex !== -1) {
        const eaten = food[eatenFoodIndex];
        const earnedPoints = eaten.points * pointMultiplier;
        setScore((s) => s + earnedPoints);

        if (eaten.type === 'NORMAL') {
          soundManager.playEat();
          spawnParticles(eaten.position, '#ef4444', 14);
          addFloatingText(eaten.position, `+${earnedPoints}`, '#ef4444');

          updateStats((st) => ({
            ...st,
            totalApplesEaten: st.totalApplesEaten + 1,
          }));

          if (mode === 'TIME_ATTACK') {
            setTimeRemaining((t) => t + 2);
          }

          if (mode === 'CAMPAIGN' && currentCampaignLevel) {
            const nextCount = applesEatenInLevel + 1;
            setApplesEatenInLevel(nextCount);
            if (nextCount >= currentCampaignLevel.targetApples) {
              setIsVictory(true);
              soundManager.playVictory();
              return [newHead, ...prevSnake];
            }
          }
        } else {
          // Special Power-up Eaten
          soundManager.playPowerUp();
          updateStats((st) => ({ ...st, powerUpsCollected: st.powerUpsCollected + 1 }));

          if (eaten.type === 'GOLDEN_APPLE') {
            spawnParticles(eaten.position, '#eab308', 20);
            addFloatingText(eaten.position, `+${earnedPoints}!`, '#eab308');
            if (mode === 'TIME_ATTACK') {
              setTimeRemaining((t) => t + 4);
            }
          } else if (eaten.type === 'SPEED_BOOST') {
            spawnParticles(eaten.position, '#f59e0b', 16);
            addFloatingText(eaten.position, 'KILAT x2!', '#f59e0b');
            setActivePowerUps((prev) => [
              ...prev.filter((p) => p.type !== 'SPEED_BOOST'),
              { type: 'SPEED_BOOST', duration: 6, remainingTime: 6 },
            ]);
          } else if (eaten.type === 'SLOW_MO') {
            spawnParticles(eaten.position, '#06b6d4', 16);
            addFloatingText(eaten.position, 'LAMBAT!', '#06b6d4');
            setActivePowerUps((prev) => [
              ...prev.filter((p) => p.type !== 'SLOW_MO'),
              { type: 'SLOW_MO', duration: 6, remainingTime: 6 },
            ]);
          } else if (eaten.type === 'GHOST') {
            spawnParticles(eaten.position, '#a855f7', 18);
            addFloatingText(eaten.position, 'HANTU!', '#a855f7');
            setActivePowerUps((prev) => [
              ...prev.filter((p) => p.type !== 'GHOST'),
              { type: 'GHOST', duration: 5, remainingTime: 5 },
            ]);
          } else if (eaten.type === 'SHRINK') {
            spawnParticles(eaten.position, '#10b981', 16);
            addFloatingText(eaten.position, 'PENDEK -3!', '#10b981');
            // Chop tail by up to 3 segments
            const newSegments = [newHead, ...prevSnake.slice(0, Math.max(3, prevSnake.length - 3))];
            return newSegments;
          }
        }

        // Remove eaten food and spawn new
        const remainingFood = food.filter((_, idx) => idx !== eatenFoodIndex);

        // Always ensure at least 1 NORMAL food exists
        const hasNormal = remainingFood.some((f) => f.type === 'NORMAL');
        const nextFoodList = [...remainingFood];

        if (!hasNormal || nextFoodList.length === 0) {
          const newNormalCoord = getRandomFreeCoordinate(
            [newHead, ...prevSnake],
            obstacles,
            nextFoodList
          );
          nextFoodList.push({
            position: newNormalCoord,
            type: 'NORMAL',
            points: 10,
          });
        }

        // 30% chance to spawn a bonus power-up item if there is only 1 food on board
        if (nextFoodList.length === 1 && Math.random() < 0.32) {
          const powerUpTypes: PowerUpType[] = [
            'GOLDEN_APPLE',
            'SPEED_BOOST',
            'SLOW_MO',
            'GHOST',
            'SHRINK',
          ];
          const chosen = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
          const bonusCoord = getRandomFreeCoordinate(
            [newHead, ...prevSnake],
            obstacles,
            nextFoodList
          );

          nextFoodList.push({
            position: bonusCoord,
            type: chosen,
            points: chosen === 'GOLDEN_APPLE' ? 30 : 15,
            expiresAt: Date.now() + 10000, // 10s bonus lifetime
          });
        }

        setFood(nextFoodList);
        return [newHead, ...prevSnake];
      }

      // Normal movement without eating: move head forward, remove tail
      return [newHead, ...prevSnake.slice(0, -1)];
    });
  }, [
    isPaused,
    isGameOver,
    isVictory,
    activePowerUps,
    wallPassThrough,
    mode,
    currentCampaignLevel,
    obstacles,
    food,
    applesEatenInLevel,
    handleGameOver,
    spawnParticles,
    addFloatingText,
    updateStats,
    getRandomFreeCoordinate,
  ]);

  // Main animation / Game loop with time step
  useEffect(() => {
    let baseSpeed = SPEED_MS[speedLevel];

    // Speed modifiers from power-ups
    if (activePowerUps.some((p) => p.type === 'SPEED_BOOST')) {
      baseSpeed = Math.floor(baseSpeed * 0.65);
    } else if (activePowerUps.some((p) => p.type === 'SLOW_MO')) {
      baseSpeed = Math.floor(baseSpeed * 1.45);
    }

    const loop = (timestamp: number) => {
      // 1. Game tick interval check
      if (timestamp - lastTickTimeRef.current >= baseSpeed) {
        lastTickTimeRef.current = timestamp;
        gameTick();
      }

      // 2. 1-second countdown for Time Attack & Power-up timers
      if (timestamp - lastSecondTimeRef.current >= 100) {
        const delta = (timestamp - lastSecondTimeRef.current) / 1000;
        lastSecondTimeRef.current = timestamp;

        // Decrement active power-up timers
        setActivePowerUps((prev) =>
          prev
            .map((p) => ({ ...p, remainingTime: p.remainingTime - delta }))
            .filter((p) => p.remainingTime > 0)
        );

        // Expire timed food
        const now = Date.now();
        setFood((prev) => prev.filter((f) => !f.expiresAt || f.expiresAt > now));

        // Time Attack countdown
        if (mode === 'TIME_ATTACK' && !isPaused && !isGameOver && !isVictory) {
          setTimeRemaining((prev) => {
            const next = Math.max(0, prev - delta);
            if (next <= 0) {
              handleGameOver();
            }
            return Math.round(next * 10) / 10;
          });
        }
      }

      // 3. Update particle physics for silky 60fps visuals
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - p.decay,
          }))
          .filter((p) => p.alpha > 0)
      );

      // 4. Update floating text physics
      setFloatingTexts((prev) =>
        prev
          .map((ft) => ({
            ...ft,
            y: ft.y + ft.vy,
            alpha: ft.alpha - 0.025,
          }))
          .filter((ft) => ft.alpha > 0)
      );

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [speedLevel, activePowerUps, mode, isPaused, isGameOver, isVictory, gameTick, handleGameOver]);

  // Initial game setup on mount
  useEffect(() => {
    resetGame('CLASSIC', 0);
  }, []);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection('RIGHT');
          break;
        case ' ':
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, togglePause]);

  // Mode change handler
  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
    setCurrentLevelIndex(0);
    resetGame(newMode, 0);
    soundManager.playClick();
  };

  // Reset career stats
  const handleResetStats = () => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem('snake_game_stats');
  };

  return {
    snake,
    direction,
    food,
    obstacles,
    currentCampaignLevel,
    skinId,
    setSkinId,
    activePowerUps,
    particles,
    floatingTexts,
    score,
    highScore: getHighScoreForMode(mode),
    isGameOver,
    isVictory,
    isNewHighScore,
    isPaused,
    mode,
    speedLevel,
    setSpeedLevel,
    wallPassThrough,
    setWallPassThrough,
    isMuted,
    toggleMute,
    volume,
    changeVolume,
    currentLevelIndex,
    applesEatenInLevel,
    timeRemaining: Math.ceil(timeRemaining),
    stats,
    changeDirection,
    togglePause,
    resetGame: () => resetGame(mode, currentLevelIndex),
    handleSelectMode,
    advanceToNextCampaignLevel,
    handleResetStats,
  };
};
