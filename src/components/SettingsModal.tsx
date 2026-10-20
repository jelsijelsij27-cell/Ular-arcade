import React from 'react';
import { X, Volume2, VolumeX, ShieldCheck, Skull, Gauge } from 'lucide-react';
import { SnakeSkinId, SpeedLevel } from '../types/game';
import { SKINS } from '../utils/constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speed: SpeedLevel;
  onSpeedChange: (speed: SpeedLevel) => void;
  wallPassThrough: boolean;
  onWallPassThroughChange: (pass: boolean) => void;
  currentSkin: SnakeSkinId;
  onSkinChange: (skinId: SnakeSkinId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  speed,
  onSpeedChange,
  wallPassThrough,
  onWallPassThroughChange,
  currentSkin,
  onSkinChange,
  isMuted,
  onToggleMute,
  volume,
  onVolumeChange,
}) => {
  if (!isOpen) return null;

  const speedOptions: { id: SpeedLevel; label: string; desc: string }[] = [
    { id: 'SLOW', label: 'Santai', desc: 'Cocok untuk belajar' },
    { id: 'NORMAL', label: 'Normal', desc: 'Standar arcade seimbang' },
    { id: 'FAST', label: 'Cepat', desc: 'Refleks gesit & lincah' },
    { id: 'EXTREME', label: 'Ekstrem', desc: 'Tantangan kecepatan kilat' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Pengaturan Permainan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Snake Skin Selection */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold text-slate-300">PILIHAN SKIN ULAR</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SKINS.map((s) => {
              const isSelected = currentSkin === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSkinChange(s.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{s.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{s.patternType}</span>
                  </div>

                  {/* Visual snake swatch */}
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: s.headColor }}
                    />
                    <div
                      className="w-3 h-3 rounded-md"
                      style={{ backgroundColor: s.bodyColor }}
                    />
                    <div
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: s.tailColor }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Speed Option */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>KECEPATAN GERAK</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {speedOptions.map((opt) => {
              const isSelected = speed === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSpeedChange(opt.id)}
                  className={`flex flex-col p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Wall Rule */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold text-slate-300">ATURAN BATAS DINDING</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onWallPassThroughChange(false)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                !wallPassThrough
                  ? 'bg-rose-500/10 border-rose-500 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Skull className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">Dinding Padat (Klasik)</span>
                <span className="text-[11px] text-slate-400">Menabrak tepi arena langsung mati.</span>
              </div>
            </button>

            <button
              onClick={() => onWallPassThroughChange(true)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                wallPassThrough
                  ? 'bg-emerald-500/10 border-emerald-500 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">Tembus Sisi (Wrap)</span>
                <span className="text-[11px] text-slate-400">Muncul kembali dari sisi seberang.</span>
              </div>
            </button>
          </div>
        </div>

        {/* 4. Audio Settings */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold text-slate-300">AUDIO & EFEK SUARA</label>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Efek Suara Sintetis</span>
              <button
                onClick={onToggleMute}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  !isMuted
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isMuted ? 'Mati' : 'Aktif'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 w-16">Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="font-mono-numbers text-xs text-slate-300 w-10 text-right">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
        >
          Selesai & Simpan
        </button>
      </div>
    </div>
  );
};
