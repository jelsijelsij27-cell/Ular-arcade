import React from 'react';
import { ActivePowerUp, GameMode } from '../types/game';
import { Trophy, Flame, Zap, Shield, Sparkles, Clock } from 'lucide-react';

interface HUDProps {
  score: number;
  highScore: number;
  mode: GameMode;
  levelNumber?: number;
  targetApples?: number;
  applesEatenInLevel?: number;
  timeRemaining?: number; // for TIME_ATTACK
  snakeLength: number;
  activePowerUps: ActivePowerUp[];
}

export const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  mode,
  levelNumber,
  targetApples,
  applesEatenInLevel = 0,
  timeRemaining,
  snakeLength,
  activePowerUps,
}) => {
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'GOLDEN_APPLE':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'SPEED_BOOST':
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'SLOW_MO':
        return <Clock className="w-3.5 h-3.5 text-cyan-400" />;
      case 'GHOST':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
      case 'SHRINK':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return null;
    }
  };

  const getPowerUpLabel = (type: string) => {
    switch (type) {
      case 'GOLDEN_APPLE':
        return 'Bonus Emas';
      case 'SPEED_BOOST':
        return 'Kilat Multiplier';
      case 'SLOW_MO':
        return 'Gerak Lambat';
      case 'GHOST':
        return 'Tembus Hantu';
      case 'SHRINK':
        return 'Pemendek Ekor';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-[520px] mx-auto flex flex-col gap-2">
      {/* Primary Score & Status Header */}
      <div className="grid grid-cols-3 items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
        {/* Left: Current Score */}
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-slate-400 tracking-wider">SKOR</span>
          <span className="font-mono-numbers text-2xl font-extrabold text-white tracking-tight">
            {score}
          </span>
        </div>

        {/* Center: Mode Target / Time remaining */}
        <div className="flex flex-col items-center text-center">
          {mode === 'CAMPAIGN' && targetApples ? (
            <>
              <span className="text-[11px] font-medium text-slate-400">
                LEVEL {levelNumber} TARGET
              </span>
              <span className="font-mono-numbers text-sm font-semibold text-emerald-400">
                {applesEatenInLevel} / {targetApples} Buah
              </span>
            </>
          ) : mode === 'TIME_ATTACK' ? (
            <>
              <span className="text-[11px] font-medium text-slate-400">SISA WAKTU</span>
              <span
                className={`font-mono-numbers text-xl font-bold ${
                  (timeRemaining || 0) <= 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
                }`}
              >
                {timeRemaining ?? 0}s
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-medium text-slate-400">PANJANG ULAR</span>
              <span className="font-mono-numbers text-base font-semibold text-slate-200">
                {snakeLength} Ruas
              </span>
            </>
          )}
        </div>

        {/* Right: High Score */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400/90">
            <Trophy className="w-3 h-3" />
            <span>REKOR</span>
          </div>
          <span className="font-mono-numbers text-2xl font-bold text-amber-400 tracking-tight">
            {highScore}
          </span>
        </div>
      </div>

      {/* Active Power-Ups Banner */}
      {activePowerUps.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {activePowerUps.map((p) => {
            const pct = Math.max(0, Math.min(100, (p.remainingTime / p.duration) * 100));
            return (
              <div
                key={p.type}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                {getPowerUpIcon(p.type)}
                <span className="font-medium text-slate-300">{getPowerUpLabel(p.type)}</span>
                <span className="font-mono-numbers text-emerald-400 font-semibold">
                  {p.remainingTime.toFixed(1)}s
                </span>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-100"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
