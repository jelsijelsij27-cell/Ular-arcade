import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Award } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  isVictory?: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  applesEaten: number;
  snakeLength: number;
  levelNumber?: number;
  hasNextLevel?: boolean;
  onPlayAgain: () => void;
  onNextLevel?: () => void;
  onReturnMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isVictory = false,
  score,
  highScore,
  isNewHighScore,
  applesEaten,
  snakeLength,
  levelNumber,
  hasNextLevel = false,
  onPlayAgain,
  onNextLevel,
  onReturnMenu,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col gap-6 text-center">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center gap-2">
          {isVictory ? (
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-8 h-8" />
            </div>
          ) : isNewHighScore ? (
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-8 h-8" />
            </div>
          )}

          <h2 className="text-2xl font-extrabold text-white">
            {isVictory
              ? `Level ${levelNumber} Berhasil Selesai!`
              : isNewHighScore
              ? 'Rekor Skor Baru!'
              : 'Permainan Selesai'}
          </h2>
          <p className="text-sm text-slate-400">
            {isVictory
              ? 'Kerja bagus! Kamu berhasil menaklukkan tantangan ini.'
              : isNewHighScore
              ? 'Luar biasa! Kamu memecahkan rekor skor tertinggi sebelumnya.'
              : 'Ular menabrak rintangan atau dirinya sendiri.'}
          </p>
        </div>

        {/* Score & Statistics Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-500">SKOR AKHIR</span>
            <span className="font-mono-numbers text-2xl font-black text-white">{score}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-500">APEL DIMAKAN</span>
            <span className="font-mono-numbers text-xl font-bold text-emerald-400">{applesEaten}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-500">REKOR TERBAIK</span>
            <span className="font-mono-numbers text-xl font-bold text-amber-400">{highScore}</span>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>Panjang akhir ular:</span>
          <span className="font-mono-numbers font-semibold text-slate-200">{snakeLength} ruas</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {isVictory && hasNextLevel && onNextLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg active:scale-98"
            >
              <span>Lanjut ke Level Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onPlayAgain}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
          )}

          <button
            onClick={onReturnMenu}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
          >
            Pilih Mode Lain
          </button>
        </div>
      </div>
    </div>
  );
};
