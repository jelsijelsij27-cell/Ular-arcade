import React, { useState } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { GameCanvas } from './components/GameCanvas';
import { Controls } from './components/Controls';
import { HUD } from './components/HUD';
import { ModeSelector } from './components/ModeSelector';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SKINS, CAMPAIGN_LEVELS } from './utils/constants';
import {
  Settings,
  Trophy,
  HelpCircle,
  Play,
  Flame,
  Clock,
  Shield,
  Scissors,
  Sparkles,
  Gamepad2,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  const {
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
    highScore,
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
    timeRemaining,
    stats,
    changeDirection,
    togglePause,
    resetGame,
    handleSelectMode,
    advanceToNextCampaignLevel,
    handleResetStats,
  } = useSnakeGame();

  // Modal open states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const currentSkin = SKINS.find((s) => s.id === skinId) || SKINS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* 1. Universal Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span>Game Ular Arcade</span>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Cara Bermain</span>
            </button>
            <button
              onClick={() => setIsStatsOpen(true)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Statistik & Rekor</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Pengaturan</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              aria-label="Buka Pengaturan"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={resetGame}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Mulai Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col gap-6">
        {/* Game Mode Selector Bar */}
        <div className="w-full">
          <ModeSelector
            currentMode={mode}
            onSelectMode={handleSelectMode}
            disabled={!isGameOver && !isPaused && snake.length > 5}
          />
        </div>

        {/* 2-Column Split Layout for Desktop & Single Column for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Stage: Canvas + HUD + Controls (col-span 7 on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-center gap-3">
            {/* HUD Status Header */}
            <HUD
              score={score}
              highScore={highScore}
              mode={mode}
              levelNumber={currentCampaignLevel?.levelNumber}
              targetApples={currentCampaignLevel?.targetApples}
              applesEatenInLevel={applesEatenInLevel}
              timeRemaining={timeRemaining}
              snakeLength={snake.length}
              activePowerUps={activePowerUps}
            />

            {/* Interactive Game Canvas */}
            <GameCanvas
              snake={snake}
              direction={direction}
              food={food}
              obstacles={obstacles}
              levelConfig={currentCampaignLevel}
              skinId={skinId}
              activePowerUps={activePowerUps}
              particles={particles}
              floatingTexts={floatingTexts}
              isGameOver={isGameOver}
              isPaused={isPaused}
              wallPassThrough={wallPassThrough}
              onSwipeDirection={changeDirection}
            />

            {/* Controls (Virtual D-pad for mobile, hints for desktop) */}
            <Controls
              onDirectionChange={changeDirection}
              onTogglePause={togglePause}
              onRestart={resetGame}
              isPaused={isPaused}
              isGameOver={isGameOver}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          </div>

          {/* Side Panel: Mission Intel, Skins & Power-up Quick Guide (col-span 5 on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* 1. Mode Status & Objective Card */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">MISI AKTIF</span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {mode === 'CLASSIC' && 'Mode Klasik'}
                  {mode === 'CAMPAIGN' && `Level ${currentCampaignLevel?.levelNumber || 1} dari 5`}
                  {mode === 'TIME_ATTACK' && 'Serangan Waktu 60s'}
                  {mode === 'OBSTACLES' && 'Labirin Batu Kilat'}
                </span>
              </div>

              {mode === 'CAMPAIGN' && currentCampaignLevel ? (
                <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <h3 className="text-xs font-bold text-white">{currentCampaignLevel.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {currentCampaignLevel.description}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>Target apel level ini:</span>
                    <span className="font-mono-numbers font-bold text-emerald-400">
                      {applesEatenInLevel} / {currentCampaignLevel.targetApples}
                    </span>
                  </div>
                </div>
              ) : mode === 'TIME_ATTACK' ? (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                  Kumpulkan apel sebanyak mungkin dalam 60 detik! Apel merah memberikan tambahan +2 detik dan apel emas memberikan +4 detik.
                </div>
              ) : mode === 'OBSTACLES' ? (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                  Arena dipenuhi rintangan batu pilar. Waspada saat bermanuver di lorong sempit.
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                  Pengalaman arcade retro murni. Ambil setiap apel merah untuk memperpanjang ular dan hindari menabrak tubuh sendiri.
                </div>
              )}

              {/* Wall rule note */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Aturan Dinding:</span>
                <span className={wallPassThrough ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                  {wallPassThrough ? 'Tembus Sisi (Wrap)' : 'Dinding Padat (Mati)'}
                </span>
              </div>
            </div>

            {/* 2. Quick Skin Selector */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">PILIHAN SKIN ULAR</span>
                <span className="text-[11px] text-slate-400 font-mono-numbers">{currentSkin.name}</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {SKINS.map((s) => {
                  const isSelected = skinId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSkinId(s.id)}
                      title={s.name}
                      className={`h-11 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-slate-800 ring-2 ring-emerald-500/30'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.headColor }} />
                        <div className="w-2 h-2 rounded-xs" style={{ backgroundColor: s.bodyColor }} />
                      </div>
                      <span className="text-[9px] text-slate-400 truncate max-w-[50px]">{s.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Power-Up Legend */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">PANDUAN BUAH SPESIAL</span>
                <button
                  onClick={() => setIsHowToPlayOpen(true)}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded bg-rose-500/10 flex items-center justify-center text-xs">🍎</div>
                  <div>
                    <span className="font-semibold block text-white text-[11px]">Apel Merah</span>
                    <span className="text-[10px] text-slate-400">+10 Poin</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-amber-400 text-[11px]">Apel Emas</span>
                    <span className="text-[10px] text-slate-400">+30 Poin Kilat</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-orange-400 text-[11px]">Kilat Speed</span>
                    <span className="text-[10px] text-slate-400">Poin x2 (6s)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-purple-400 text-[11px]">Mode Hantu</span>
                    <span className="text-[10px] text-slate-400">Kebal Tubuh (5s)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Quick Career Stats Snapshot */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">TOTAL APEL</span>
                <span className="font-mono-numbers text-base font-bold text-white">
                  {stats.totalApplesEaten}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">ULAR TERPANJANG</span>
                <span className="font-mono-numbers text-base font-bold text-emerald-400">
                  {stats.longestSnake} ruas
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">TOTAL MAIN</span>
                <span className="font-mono-numbers text-base font-bold text-slate-300">
                  {stats.gamesPlayed} kali
                </span>
              </div>
              <button
                onClick={() => setIsStatsOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium"
              >
                Detail
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Game Ular Arcade Modern &copy; 2026. Bermain santai dan nikmati tantangannya.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsHowToPlayOpen(true)} className="hover:text-slate-200">
              Panduan
            </button>
            <span aria-hidden="true">&middot;</span>
            <button onClick={() => setIsStatsOpen(true)} className="hover:text-slate-200">
              Papan Rekor
            </button>
            <span aria-hidden="true">&middot;</span>
            <button onClick={() => setIsSettingsOpen(true)} className="hover:text-slate-200">
              Pengaturan
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GameOverModal
        isOpen={isGameOver || isVictory}
        isVictory={isVictory}
        score={score}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        applesEaten={applesEatenInLevel || score / 10}
        snakeLength={snake.length}
        levelNumber={currentCampaignLevel?.levelNumber}
        hasNextLevel={Boolean(
          mode === 'CAMPAIGN' && currentLevelIndex < CAMPAIGN_LEVELS.length - 1
        )}
        onPlayAgain={resetGame}
        onNextLevel={advanceToNextCampaignLevel}
        onReturnMenu={() => {
          handleSelectMode('CLASSIC');
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        speed={speedLevel}
        onSpeedChange={setSpeedLevel}
        wallPassThrough={wallPassThrough}
        onWallPassThroughChange={setWallPassThrough}
        currentSkin={skinId}
        onSkinChange={setSkinId}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        volume={volume}
        onVolumeChange={changeVolume}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
