import React from 'react';
import { X, Sparkles, BookOpen, Flame, Clock, Shield, Scissors, HelpCircle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Panduan Cara Bermain</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Aturan Dasar */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Tujuan Permainan</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kendalikan ular untuk memakan apel dan power-up sebanyak mungkin. Setiap makanan membuat ular tumbuh lebih panjang. Hindari menabrak tubuh sendiri atau dinding (jika aturan dinding padat aktif).
          </p>
        </div>

        {/* 2. Jenis Makanan & Power-up */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Buah & Power-Up Spesial</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-lg">
                🍎
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Apel Merah (+10 Poin)</span>
                <span className="text-[11px] text-slate-400">Makanan pokok, menambah panjang ular 1 ruas.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 block">Apel Emas (+30 Poin)</span>
                <span className="text-[11px] text-slate-400">Bonus langka berbatas waktu dengan poin berlipat!</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-orange-400 block">Kilat Kecepatan (Multi Poin)</span>
                <span className="text-[11px] text-slate-400">Ular melesat lebih cepat dan poin digandakan selama 6 detik.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-400 block">Es Lambat (Slow Motion)</span>
                <span className="text-[11px] text-slate-400">Memperlambat gerakan untuk manuver presisi di ruang sempit.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-400 block">Mode Hantu (Tembus Tubuh & Dinding)</span>
                <span className="text-[11px] text-slate-400">Ular menjadi kebal dari tabrakan selama 5 detik!</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 block">Gunting Pemendek (Shrink)</span>
                <span className="text-[11px] text-slate-400">Memotong 3 ruas ekor ular agar tubuh kembali lincah dan pendek.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Kontrol */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Kontrol & Navigasi</h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong className="text-white">Desktop:</strong> Gunakan panah keyboard atau tombol <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">W</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">A</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">S</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200">D</kbd>.</li>
            <li><strong className="text-white">Jeda Permainan:</strong> Tekan tombol <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Spasi</kbd> kapan saja.</li>
            <li><strong className="text-white">Ponsel / Layar Sentuh:</strong> Gunakan tombol D-Pad virtual di bawah atau usap layar (swipe) langsung pada arena permainan.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
        >
          Saya Siap Bermain
        </button>
      </div>
    </div>
  );
};
