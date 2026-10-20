import React from 'react';
import { X, Trophy, Apple, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { GameStats } from '../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Statistik & Rekor Pemain</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
            <span className="text-[10px] font-medium text-slate-500">TOTAL MAIN</span>
            <span className="font-mono-numbers text-xl font-bold text-white mt-0.5">
              {stats.gamesPlayed}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
              <Apple className="w-3 h-3 text-rose-400" />
              <span>TOTAL APEL</span>
            </div>
            <span className="font-mono-numbers text-xl font-bold text-rose-400 mt-0.5">
              {stats.totalApplesEaten}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
            <span className="text-[10px] font-medium text-slate-500">ULAR TERPANJANG</span>
            <span className="font-mono-numbers text-xl font-bold text-emerald-400 mt-0.5">
              {stats.longestSnake}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>POWER-UP</span>
            </div>
            <span className="font-mono-numbers text-xl font-bold text-amber-400 mt-0.5">
              {stats.powerUpsCollected}
            </span>
          </div>
        </div>

        {/* High Scores per Mode */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-slate-400">REKOR TERTINGGI PER MODE</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Mode Klasik</span>
                <span className="text-[10px] text-slate-500">Ular arcade murni</span>
              </div>
              <span className="font-mono-numbers text-lg font-extrabold text-amber-400">
                {stats.highScoreClassic}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Mode Kampanye</span>
                <span className="text-[10px] text-slate-500">Tahap level bertingkat</span>
              </div>
              <span className="font-mono-numbers text-lg font-extrabold text-emerald-400">
                {stats.highScoreCampaign}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Serangan Waktu</span>
                <span className="text-[10px] text-slate-500">Batas waktu 60 detik</span>
              </div>
              <span className="font-mono-numbers text-lg font-extrabold text-cyan-400">
                {stats.highScoreTimeAttack}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Rintangan Kilat</span>
                <span className="text-[10px] text-slate-500">Arena penuh batu labirin</span>
              </div>
              <span className="font-mono-numbers text-lg font-extrabold text-purple-400">
                {stats.highScoreObstacles}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              if (window.confirm('Apakah kamu yakin ingin mereset semua rekor dan statistik?')) {
                onResetStats();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Statistik</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
