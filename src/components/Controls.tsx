import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Direction } from '../types/game';

interface ControlsProps {
  onDirectionChange: (dir: Direction) => void;
  onTogglePause: () => void;
  onRestart: () => void;
  isPaused: boolean;
  isGameOver: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onDirectionChange,
  onTogglePause,
  onRestart,
  isPaused,
  isGameOver,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="w-full max-w-[520px] mx-auto flex flex-col gap-3">
      {/* Quick Actions Row */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePause}
            disabled={isGameOver}
            aria-label={isPaused ? 'Lanjutkan Permainan' : 'Jeda Permainan'}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors active:scale-95 disabled:opacity-40"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            <span>{isPaused ? 'Lanjut' : 'Jeda'}</span>
          </button>

          <button
            onClick={onRestart}
            aria-label="Mulai Ulang Permainan"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Ulangi</span>
          </button>
        </div>

        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors active:scale-95"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Virtual D-Pad for Mobile & Touch */}
      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 sm:hidden">
        {/* Top button */}
        <button
          onClick={() => onDirectionChange('UP')}
          aria-label="Gerak ke Atas"
          className="w-14 h-12 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 active:text-white text-slate-200 shadow transition-all duration-75 active:scale-90"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* Middle row: Left, Center spacer, Right */}
        <div className="flex items-center gap-3 my-1">
          <button
            onClick={() => onDirectionChange('LEFT')}
            aria-label="Gerak ke Kiri"
            className="w-14 h-12 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 active:text-white text-slate-200 shadow transition-all duration-75 active:scale-90"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="w-10 h-10 rounded-full border border-slate-700/60 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500/60 animate-pulse" />
          </div>

          <button
            onClick={() => onDirectionChange('RIGHT')}
            aria-label="Gerak ke Kanan"
            className="w-14 h-12 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 active:text-white text-slate-200 shadow transition-all duration-75 active:scale-90"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom button */}
        <button
          onClick={() => onDirectionChange('DOWN')}
          aria-label="Gerak ke Bawah"
          className="w-14 h-12 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 active:text-white text-slate-200 shadow transition-all duration-75 active:scale-90"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Keyboard Hints */}
      <div className="hidden sm:flex items-center justify-between text-xs text-slate-400 px-2 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">W</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">A</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">S</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">D</kbd>
          <span className="text-slate-500">atau Tombol Panah untuk bergerak</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">Spasi</kbd>
          <span className="text-slate-500">Jeda</span>
        </div>
      </div>
    </div>
  );
};
