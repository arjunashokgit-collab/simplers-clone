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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('setup');
  const [winnerCount, setWinnerCount] = useState<number>(GIVEAWAY_CONFIG.winnerCount);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(GIVEAWAY_CONFIG.countdownSeconds);
  const [showToast, setShowToast] = useState<boolean>(false);
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
    <div className="relative min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center font-sans p-0 sm:p-4">
      {/* Main Interactive Phone / App View */}
      <DeviceFrame isMobileOnly={true}>
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
