import React, { useState, useEffect, useMemo } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NotificationToast } from './components/NotificationToast';
import { ScreenSetup } from './components/ScreenSetup';
import { ScreenReceiving } from './components/ScreenReceiving';
import { ScreenResultPre } from './components/ScreenResultPre';
import { ScreenLiveWinners } from './components/ScreenLiveWinners';
import { EntriesModal } from './components/EntriesModal';
import { RulesModal } from './components/RulesModal';
import { ShareModal } from './components/ShareModal';
import { Dashboard } from './components/Dashboard';
import { ScreenState } from './types';
import {
  FullGiveawayData,
  loadStoredGiveawayData,
  saveStoredGiveawayData,
  buildRuntimeConfig,
} from './utils/configStorage';
import { Sliders, Smartphone, Layers, Play, Sparkles } from 'lucide-react';
import { sound } from './utils/audio';

export default function App() {
  // 1. Core Giveaway Configuration State (Loaded from localStorage or defaults)
  const [giveawayData, setGiveawayData] = useState<FullGiveawayData>(() => loadStoredGiveawayData());

  // 2. View Mode: 'split' (side-by-side) | 'dashboard' (studio only) | 'phone' (simulator only)
  const [viewMode, setViewMode] = useState<'phone' | 'dashboard' | 'split'>('split');

  // 3. Screen State for Simulator
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('setup');
  const [winnerCount, setWinnerCount] = useState<number>(giveawayData.winnerCount);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(giveawayData.countdownSeconds);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals
  const [isEntriesOpen, setIsEntriesOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Sync winnerCount & countdownSeconds if giveawayData updates
  useEffect(() => {
    setWinnerCount(giveawayData.winnerCount);
    setCountdownSeconds(giveawayData.countdownSeconds);
  }, [giveawayData.winnerCount, giveawayData.countdownSeconds]);

  // Derive runtime models (ContestPost, designatedWinners, allParticipants)
  const runtimeConfig = useMemo(() => {
    return buildRuntimeConfig(giveawayData);
  }, [giveawayData]);

  // Handle configuration changes & persistence
  const handleConfigChange = (updated: FullGiveawayData) => {
    setGiveawayData(updated);
    saveStoredGiveawayData(updated);
  };

  const handleSaveConfig = () => {
    saveStoredGiveawayData(giveawayData);
  };

  // Launch live contest directly from dashboard
  const handleLaunchContest = () => {
    saveStoredGiveawayData(giveawayData);
    setCurrentScreen('live_draw');
    if (viewMode === 'dashboard') {
      setViewMode('phone');
    }
  };

  // Auto show push toast during receiving phase
  useEffect(() => {
    if (currentScreen === 'receiving') {
      const toastTimer = setTimeout(() => {
        setShowToast(true);
      }, 2500);

      const hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 6500);

      return () => {
        clearTimeout(toastTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowToast(false);
    }
  }, [currentScreen]);

  // Dynamic header title matching exact screen progression
  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'setup':
        return 'simpliers';
      case 'receiving':
        return 'Entries';
      case 'result_pre':
      case 'live_draw':
      case 'winners_saved':
        return 'Result';
      default:
        return 'simpliers';
    }
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'receiving':
        setCurrentScreen('setup');
        break;
      case 'result_pre':
        setCurrentScreen('receiving');
        break;
      case 'live_draw':
      case 'winners_saved':
        setCurrentScreen('result_pre');
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-white flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Top Floating View Switcher Bar */}
      <header className="sticky top-0 z-40 bg-[#0e0e12]/90 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-md">
            S
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white flex items-center space-x-1.5">
              <span>Simpliers Giveaway Studio</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono">
                v2.0
              </span>
            </span>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#18181f] border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('split');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all font-medium ${
                viewMode === 'split'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Side-by-Side Split View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split View</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setViewMode('dashboard');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all font-medium ${
                viewMode === 'dashboard'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Media Dashboard"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Media Dashboard</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setViewMode('phone');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all font-medium ${
                viewMode === 'phone'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
              title="App Phone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App View</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-3 sm:p-6 flex items-start justify-center">
        {/* Layout Mode: Split (Side-by-Side Dashboard & Phone Simulator) */}
        {viewMode === 'split' && (
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Studio Dashboard */}
            <div className="lg:col-span-7 xl:col-span-8">
              <Dashboard
                config={giveawayData}
                onChange={handleConfigChange}
                onSave={handleSaveConfig}
                onLaunchContest={handleLaunchContest}
                onSwitchToPhone={() => setViewMode('phone')}
                viewMode={viewMode}
                onToggleViewMode={setViewMode}
              />
            </div>

            {/* Right: Phone Simulator */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center sticky top-20">
              <div className="text-center mb-2 flex items-center space-x-1.5 text-xs text-white/50">
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span>Live Interactive Giveaway App Preview</span>
              </div>

              <DeviceFrame isMobileOnly={true}>
                <NotificationToast
                  show={showToast}
                  onDismiss={() => setShowToast(false)}
                />

                <Header
                  title={getHeaderTitle()}
                  onBack={currentScreen !== 'setup' ? handleBack : undefined}
                  showBack={currentScreen !== 'setup'}
                  onOpenDashboard={() => setViewMode('dashboard')}
                />

                {currentScreen === 'setup' && (
                  <ScreenSetup
                    post={runtimeConfig.post}
                    winnerCount={winnerCount}
                    onSetWinnerCount={(count) => {
                      setWinnerCount(count);
                      handleConfigChange({ ...giveawayData, winnerCount: count });
                    }}
                    onContinue={() => setCurrentScreen('receiving')}
                    onOpenRules={() => setIsRulesOpen(true)}
                  />
                )}

                {currentScreen === 'receiving' && (
                  <ScreenReceiving
                    post={runtimeConfig.post}
                    onComplete={() => setCurrentScreen('result_pre')}
                  />
                )}

                {currentScreen === 'result_pre' && (
                  <ScreenResultPre
                    post={runtimeConfig.post}
                    countdownSeconds={countdownSeconds}
                    onSetCountdownSeconds={(sec) => {
                      setCountdownSeconds(sec);
                      handleConfigChange({ ...giveawayData, countdownSeconds: sec });
                    }}
                    onStartContest={() => setCurrentScreen('live_draw')}
                    onSeeEntries={() => setIsEntriesOpen(true)}
                  />
                )}

                {(currentScreen === 'live_draw' || currentScreen === 'winners_saved') && (
                  <ScreenLiveWinners
                    post={runtimeConfig.post}
                    countdownSeconds={countdownSeconds}
                    winnerCount={winnerCount}
                    designatedWinners={runtimeConfig.designatedWinners}
                    allParticipants={runtimeConfig.allParticipants}
                    onRestart={() => setCurrentScreen('live_draw')}
                    onOpenRules={() => setIsRulesOpen(true)}
                    onOpenShare={() => setIsShareOpen(true)}
                  />
                )}

                <BottomNav
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    if (tab === 'entries') setIsEntriesOpen(true);
                    if (tab === 'home') setCurrentScreen('setup');
                    if (tab === 'dashboard' || tab === 'giveaway') setViewMode('dashboard');
                  }}
                />
              </DeviceFrame>
            </div>
          </div>
        )}

        {/* Layout Mode: Dashboard Only */}
        {viewMode === 'dashboard' && (
          <div className="w-full max-w-5xl">
            <Dashboard
              config={giveawayData}
              onChange={handleConfigChange}
              onSave={handleSaveConfig}
              onLaunchContest={handleLaunchContest}
              onSwitchToPhone={() => setViewMode('phone')}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
            />
          </div>
        )}

        {/* Layout Mode: Phone Simulator Only */}
        {viewMode === 'phone' && (
          <div className="flex flex-col items-center justify-center">
            <DeviceFrame isMobileOnly={true}>
              <NotificationToast
                show={showToast}
                onDismiss={() => setShowToast(false)}
              />

              <Header
                title={getHeaderTitle()}
                onBack={currentScreen !== 'setup' ? handleBack : undefined}
                showBack={currentScreen !== 'setup'}
                onOpenDashboard={() => setViewMode('dashboard')}
              />

              {currentScreen === 'setup' && (
                <ScreenSetup
                  post={runtimeConfig.post}
                  winnerCount={winnerCount}
                  onSetWinnerCount={(count) => {
                    setWinnerCount(count);
                    handleConfigChange({ ...giveawayData, winnerCount: count });
                  }}
                  onContinue={() => setCurrentScreen('receiving')}
                  onOpenRules={() => setIsRulesOpen(true)}
                />
              )}

              {currentScreen === 'receiving' && (
                <ScreenReceiving
                  post={runtimeConfig.post}
                  onComplete={() => setCurrentScreen('result_pre')}
                />
              )}

              {currentScreen === 'result_pre' && (
                <ScreenResultPre
                  post={runtimeConfig.post}
                  countdownSeconds={countdownSeconds}
                  onSetCountdownSeconds={(sec) => {
                    setCountdownSeconds(sec);
                    handleConfigChange({ ...giveawayData, countdownSeconds: sec });
                  }}
                  onStartContest={() => setCurrentScreen('live_draw')}
                  onSeeEntries={() => setIsEntriesOpen(true)}
                />
              )}

              {(currentScreen === 'live_draw' || currentScreen === 'winners_saved') && (
                <ScreenLiveWinners
                  post={runtimeConfig.post}
                  countdownSeconds={countdownSeconds}
                  winnerCount={winnerCount}
                  designatedWinners={runtimeConfig.designatedWinners}
                  allParticipants={runtimeConfig.allParticipants}
                  onRestart={() => setCurrentScreen('live_draw')}
                  onOpenRules={() => setIsRulesOpen(true)}
                  onOpenShare={() => setIsShareOpen(true)}
                />
              )}

              <BottomNav
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'entries') setIsEntriesOpen(true);
                  if (tab === 'home') setCurrentScreen('setup');
                  if (tab === 'dashboard' || tab === 'giveaway') setViewMode('dashboard');
                }}
              />
            </DeviceFrame>
          </div>
        )}
      </main>

      {/* Slide-over Modals */}
      <EntriesModal
        isOpen={isEntriesOpen}
        onClose={() => setIsEntriesOpen(false)}
        participants={runtimeConfig.allParticipants}
        totalAuditedCount={runtimeConfig.allParticipants.length}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        post={runtimeConfig.post}
      />
    </div>
  );
}
