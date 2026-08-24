import React, { useState, useEffect } from 'react';
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
import { ScreenState } from './types';
import { GIVEAWAY_CONFIG } from './giveawayConfig';
import { sound } from './utils/audio';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('setup');
  const [winnerCount, setWinnerCount] = useState<number>(GIVEAWAY_CONFIG.winnerCount);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(GIVEAWAY_CONFIG.countdownSeconds);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals
  const [isEntriesOpen, setIsEntriesOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

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
    <div className="relative min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center font-sans">
      {/* Top Demo Bar for quick preview & mode switches */}
      <aside
        aria-label="Walkthrough Controls"
        className="w-full max-w-xl px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-50 text-xs bg-[#121215]/80 backdrop-blur-md border-b sm:border border-white/10 sm:rounded-2xl sm:my-2 shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#e60039] animate-pulse" />
          <span className="font-bold text-white tracking-tight">Simpliers Giveaway</span>
          <span className="text-[10px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
            Reconstructed UI
          </span>
        </div>

        {/* Step Navigation Pills */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              sound.playClick();
              setCurrentScreen('setup');
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              currentScreen === 'setup'
                ? 'bg-[#e60039] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            1. Setup
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setCurrentScreen('receiving');
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              currentScreen === 'receiving'
                ? 'bg-[#e60039] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            2. Entries
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setCurrentScreen('result_pre');
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              currentScreen === 'result_pre'
                ? 'bg-[#e60039] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            3. Shuffle
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setCurrentScreen('live_draw');
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              currentScreen === 'live_draw'
                ? 'bg-[#e60039] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            4. Live Draw
          </button>
        </div>

        {/* View mode toggle */}
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          title={isMobileFrame ? 'Switch to Full Width' : 'Switch to Phone Mockup'}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
        >
          {isMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Main Interactive Phone / App View */}
      <DeviceFrame isMobileOnly={isMobileFrame}>
        {/* iOS-Style Push Notification Toast */}
        <NotificationToast
          show={showToast}
          onDismiss={() => setShowToast(false)}
        />

        {/* Header Bar */}
        <Header
          title={getHeaderTitle()}
          onBack={currentScreen !== 'setup' ? handleBack : undefined}
          showBack={currentScreen !== 'setup'}
        />

        {/* Screen 1: Contest Type & Video/Post Selection */}
        {currentScreen === 'setup' && (
          <ScreenSetup
            post={GIVEAWAY_CONFIG.post}
            winnerCount={winnerCount}
            onSetWinnerCount={setWinnerCount}
            onContinue={() => setCurrentScreen('receiving')}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {/* Screen 2: Receiving Entries Progress */}
        {currentScreen === 'receiving' && (
          <ScreenReceiving
            post={GIVEAWAY_CONFIG.post}
            onComplete={() => setCurrentScreen('result_pre')}
          />
        )}

        {/* Screen 3: Result Configuration & Shuffling */}
        {currentScreen === 'result_pre' && (
          <ScreenResultPre
            post={GIVEAWAY_CONFIG.post}
            countdownSeconds={countdownSeconds}
            onSetCountdownSeconds={setCountdownSeconds}
            onStartContest={() => setCurrentScreen('live_draw')}
            onSeeEntries={() => setIsEntriesOpen(true)}
          />
        )}

        {/* Screen 4 & 5: Live Countdown Draw & Final Saved Winners */}
        {(currentScreen === 'live_draw' || currentScreen === 'winners_saved') && (
          <ScreenLiveWinners
            post={GIVEAWAY_CONFIG.post}
            countdownSeconds={countdownSeconds}
            winnerCount={winnerCount}
            designatedWinners={GIVEAWAY_CONFIG.designatedWinners}
            allParticipants={GIVEAWAY_CONFIG.allParticipants}
            onRestart={() => setCurrentScreen('live_draw')}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenShare={() => setIsShareOpen(true)}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'entries') setIsEntriesOpen(true);
            if (tab === 'home') setCurrentScreen('setup');
          }}
        />
      </DeviceFrame>

      {/* Slide-over Modals */}
      <EntriesModal
        isOpen={isEntriesOpen}
        onClose={() => setIsEntriesOpen(false)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        post={GIVEAWAY_CONFIG.post}
      />
    </div>
  );
}
