import React from 'react';
import { GameMode } from '../types/game';
import { Gamepad2, Compass, Timer, ShieldAlert } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  disabled = false,
}) => {
  const modes: { id: GameMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'CLASSIC',
      label: 'Klasik',
      desc: 'Arcade murni tanpa rintangan',
      icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'CAMPAIGN',
      label: 'Kampanye',
      desc: '5 Level bertingkat & portal',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'TIME_ATTACK',
      label: 'Waktu 60s',
      desc: 'Kejar rekor skor secepatnya',
      icon: <Timer className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'OBSTACLES',
      label: 'Labirin',
      desc: 'Arena penuh pilar rintangan',
      icon: <ShieldAlert className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
        {modes.map((m) => {
          const isSelected = currentMode === m.id;
          return (
            <button
              key={m.id}
              disabled={disabled}
              onClick={() => onSelectMode(m.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all ${
                isSelected
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-1.5">
                {m.icon}
                <span className="text-xs font-bold whitespace-nowrap">{m.label}</span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline-block mt-0.5">
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
