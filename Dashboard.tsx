import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Upload,
  Play,
  Smartphone,
  Sliders,
  Users,
  Trophy,
  Video,
  Code2,
  Volume2,
  CheckCircle2,
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { FullGiveawayData, generateTypeScriptCode, resetStoredGiveawayData } from '../utils/configStorage';
import { MediaUploader } from './MediaUploader';
import { InstagramWinner } from '../media/giveawayData';
import { Participant } from '../types';
import { RANDOM_SAMPLE_PARTICIPANTS, AVATAR_PRESETS } from '../utils/mediaPresets';
import { sound } from '../utils/audio';

interface DashboardProps {
  config: FullGiveawayData;
  onChange: (updated: FullGiveawayData) => void;
  onSave: () => void;
  onLaunchContest: () => void;
  onSwitchToPhone: () => void;
  viewMode: 'phone' | 'dashboard' | 'split';
  onToggleViewMode: (mode: 'phone' | 'dashboard' | 'split') => void;
}

type TabType = 'media' | 'winners' | 'pool' | 'settings' | 'export';

export const Dashboard: React.FC<DashboardProps> = ({
  config,
  onChange,
  onSave,
  onLaunchContest,
  onSwitchToPhone,
  viewMode,
  onToggleViewMode,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('media');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Field updater helpers
  const updateField = <K extends keyof FullGiveawayData>(key: K, value: FullGiveawayData[K]) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const handleSaveClick = () => {
    onSave();
    try {
      sound.playWin();
    } catch {}
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Winner Management Helpers
  const handleAddWinner = () => {
    try {
      sound.playClick();
    } catch {}
    const newIdx = config.winners.length + 1;
    const randomAvatar =
      AVATAR_PRESETS[newIdx % AVATAR_PRESETS.length]?.url ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    const newWinner: InstagramWinner = {
      username: `winner_${newIdx}`,
      fullName: `Winner ${newIdx}`,
      profileImage: randomAvatar,
      comment: 'Super excited to participate! 🎉🔥',
      hasGif: false,
    };

    const newWinners = [...config.winners, newWinner];
    onChange({
      ...config,
      winners: newWinners,
      winnerCount: Math.min(newWinners.length, Math.max(config.winnerCount, newWinners.length)),
    });
  };

  const handleUpdateWinner = (index: number, updated: Partial<InstagramWinner>) => {
    const nextWinners = config.winners.map((w, idx) => (idx === index ? { ...w, ...updated } : w));
    onChange({
      ...config,
      winners: nextWinners,
    });
  };

  const handleDeleteWinner = (index: number) => {
    if (config.winners.length <= 1) {
      alert('You must have at least 1 winner.');
      return;
    }
    try {
      sound.playClick();
    } catch {}
    const nextWinners = config.winners.filter((_, idx) => idx !== index);
    onChange({
      ...config,
      winners: nextWinners,
      winnerCount: Math.min(config.winnerCount, nextWinners.length),
    });
  };

  const handleMoveWinner = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.winners.length) return;

    try {
      sound.playClick();
    } catch {}
    const nextWinners = [...config.winners];
    const temp = nextWinners[index];
    nextWinners[index] = nextWinners[targetIdx];
    nextWinners[targetIdx] = temp;

    onChange({
      ...config,
      winners: nextWinners,
    });
  };

  // Extra Pool Entries Helpers
  const handleAddSampleParticipants = () => {
    try {
      sound.playClick();
    } catch {}
    const newItems: Participant[] = RANDOM_SAMPLE_PARTICIPANTS.map((p, idx) => ({
      id: `gen-${Date.now()}-${idx}`,
      username: p.username,
      fullName: p.fullName,
      avatarUrl: p.avatarUrl,
      comment: p.comment,
      likesCount: Math.floor(Math.random() * 20) + 1,
      timeAgo: `${Math.floor(Math.random() * 4) + 1}d`,
      isValid: true,
    }));

    onChange({
      ...config,
      extraParticipants: [...config.extraParticipants, ...newItems],
    });
  };

  const handleClearExtraParticipants = () => {
    if (confirm('Clear all extra background participants?')) {
      onChange({
        ...config,
        extraParticipants: [],
      });
    }
  };

  const handleCopyTypeScript = () => {
    const code = generateTypeScriptCode(config);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    sound.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedJson(true);
    sound.playClick();
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `giveaway_config_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onChange({
          ...config,
          ...parsed,
        });
        alert('Configuration imported successfully!');
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset everything to original giveawayData.ts defaults?')) {
      const reset = resetStoredGiveawayData();
      onChange(reset);
      sound.playClick();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col bg-[#111115] border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white">
      {/* Top Studio Header */}
      <div className="bg-gradient-to-r from-[#18181f] via-[#1c121e] to-[#18181f] border-b border-white/10 px-5 py-4 flex flex-wrap items-center justify-between gap-4 select-none">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Simpliers Media & Setup Studio
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Dashboard
              </span>
            </div>
            <p className="text-xs text-white/50">
              Customize media files, Instagram post thumbnails, designated winners & entries
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => onToggleViewMode('split')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                viewMode === 'split'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Side-by-Side Split View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split View</span>
            </button>
            <button
              onClick={() => onToggleViewMode('dashboard')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Full Dashboard"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard Only</span>
            </button>
            <button
              onClick={() => onToggleViewMode('phone')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                viewMode === 'phone'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Phone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">App View</span>
            </button>
          </div>

          <button
            onClick={handleSaveClick}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={onLaunchContest}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Draw</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#141419] border-b border-white/5 px-5 py-2 flex items-center space-x-2 overflow-x-auto select-none">
        <button
          onClick={() => {
            setActiveTab('media');
            sound.playClick();
          }}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'media'
              ? 'bg-[#e60039] text-white shadow-md shadow-rose-600/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Post & Media</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('winners');
            sound.playClick();
          }}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'winners'
              ? 'bg-[#e60039] text-white shadow-md shadow-rose-600/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Instagram Winners ({config.winners.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('pool');
            sound.playClick();
          }}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'pool'
              ? 'bg-[#e60039] text-white shadow-md shadow-rose-600/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Shuffle Pool ({config.extraParticipants.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            sound.playClick();
          }}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'settings'
              ? 'bg-[#e60039] text-white shadow-md shadow-rose-600/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Draw Settings</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('export');
            sound.playClick();
          }}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'export'
              ? 'bg-[#e60039] text-white shadow-md shadow-rose-600/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Export & Sync</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)] space-y-6">
        {/* ============================================================ */}
        {/* TAB 1: MEDIA & POST SETUP */}
        {/* ============================================================ */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">Instagram Post & Video Media</h2>
                <p className="text-xs text-white/50">
                  Upload the contest thumbnail photo, configure caption text, and author profile.
                </p>
              </div>
            </div>

            {/* Post Thumbnail Uploader */}
            <MediaUploader
              label="Contest Post / Video Thumbnail Media"
              sublabel="Upload any photo from your device or pick a preset (Displayed during the live draw)"
              value={config.videoImage}
              onChange={(url) => updateField('videoImage', url)}
              type="post"
              aspectRatio="video"
            />

            {/* Post Caption */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/90 block">
                Instagram Post Video Caption
              </label>
              <textarea
                rows={3}
                value={config.videoCaption}
                onChange={(e) => updateField('videoCaption', e.target.value)}
                placeholder="Enter post caption..."
                className="w-full bg-[#141418] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-rose-500 leading-relaxed font-sans"
              />
            </div>

            {/* Author Profile Settings */}
            <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-rose-400">
                Author & Host Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MediaUploader
                  label="Host Profile Avatar Photo"
                  sublabel="Square or circular profile picture"
                  value={config.authorAvatar}
                  onChange={(url) => updateField('authorAvatar', url)}
                  type="avatar"
                  aspectRatio="circle"
                />

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-white/80 block mb-1">
                      Giveaway Contest Title
                    </label>
                    <input
                      type="text"
                      value={config.giveawayTitle}
                      onChange={(e) => updateField('giveawayTitle', e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/80 block mb-1">
                      Author Full Name
                    </label>
                    <input
                      type="text"
                      value={config.authorName}
                      onChange={(e) => updateField('authorName', e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/80 block mb-1">
                      Author Instagram Handle (@username)
                    </label>
                    <input
                      type="text"
                      value={config.authorUsername}
                      onChange={(e) => updateField('authorUsername', e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Post Engagement & Verification Details */}
            <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-rose-400">
                Audit & Stats Details
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Comments Count
                  </label>
                  <input
                    type="number"
                    value={config.commentsCount}
                    onChange={(e) => updateField('commentsCount', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Likes Count
                  </label>
                  <input
                    type="number"
                    value={config.likesCount}
                    onChange={(e) => updateField('likesCount', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Result Code
                  </label>
                  <input
                    type="text"
                    value={config.resultCode}
                    onChange={(e) => updateField('resultCode', e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-rose-400 font-bold focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Result Verification Link
                  </label>
                  <input
                    type="text"
                    value={config.resultLink}
                    onChange={(e) => updateField('resultLink', e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: INSTAGRAM WINNERS SETUP */}
        {/* ============================================================ */}
        {activeTab === 'winners' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-3 gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Designated Instagram Winners</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    {config.winners.length} configured
                  </span>
                </h2>
                <p className="text-xs text-white/50">
                  These participants are guaranteed to win when the live countdown finishes.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddWinner}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#e60039] hover:bg-[#d00034] text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Winner</span>
                </button>
              </div>
            </div>

            {/* List of Winner Cards */}
            <div className="space-y-4">
              {config.winners.map((winner, idx) => (
                <div
                  key={idx}
                  className="bg-[#141418] border border-white/10 rounded-2xl p-4 space-y-4 relative shadow-md transition-all hover:border-white/20"
                >
                  {/* Top Bar for this Winner */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs font-mono">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-white">Winner #{idx + 1}</span>
                      {idx < config.winnerCount && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                          Active in Draw
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveWinner(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveWinner(idx, 'down')}
                        disabled={idx === config.winners.length - 1}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteWinner(idx)}
                        className="p-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 hover:text-rose-300"
                        title="Delete Winner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Profile Media & Details Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Winner Avatar Uploader */}
                    <div className="md:col-span-1">
                      <MediaUploader
                        label="Profile Photo"
                        value={winner.profileImage}
                        onChange={(url) => handleUpdateWinner(idx, { profileImage: url })}
                        type="avatar"
                        aspectRatio="circle"
                      />
                    </div>

                    {/* Winner Details */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-white/70 block mb-1">
                            Instagram Username (@handle)
                          </label>
                          <input
                            type="text"
                            value={winner.username}
                            onChange={(e) => handleUpdateWinner(idx, { username: e.target.value })}
                            placeholder="e.g. itsmebinsabu"
                            className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-white/70 block mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={winner.fullName}
                            onChange={(e) => handleUpdateWinner(idx, { fullName: e.target.value })}
                            placeholder="e.g. Mebin Sabu"
                            className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-white/70 block mb-1">
                          Winning Comment Text
                        </label>
                        <input
                          type="text"
                          value={winner.comment}
                          onChange={(e) => handleUpdateWinner(idx, { comment: e.target.value })}
                          placeholder="e.g. Rider pro max 🤟"
                          className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div className="flex items-center space-x-3 pt-1">
                        <label className="flex items-center space-x-2 cursor-pointer text-xs text-white/80">
                          <input
                            type="checkbox"
                            checked={winner.hasGif || false}
                            onChange={(e) => handleUpdateWinner(idx, { hasGif: e.target.checked })}
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                          />
                          <span>Show GIF badge tag on comment</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: SHUFFLE POOL ENTRIES */}
        {/* ============================================================ */}
        {activeTab === 'pool' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-3 gap-2">
              <div>
                <h2 className="text-base font-bold text-white">Shuffle Animation Participants</h2>
                <p className="text-xs text-white/50">
                  These participants rapidly flash on the screen during the live countdown draw.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddSampleParticipants}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Generate 6 Realistic Entries</span>
                </button>
                <button
                  onClick={handleClearExtraParticipants}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-600/20 text-white/70 hover:text-rose-400 text-xs font-medium transition-all"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {config.extraParticipants.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="bg-[#141418] border border-white/5 rounded-2xl p-3 flex items-start space-x-3 text-xs"
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.username}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">{p.username}</div>
                    <div className="text-[10px] text-white/50 truncate">{p.fullName}</div>
                    <div className="text-white/80 text-[11px] truncate mt-1 italic">
                      "{p.comment}"
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = config.extraParticipants.filter((_, i) => i !== idx);
                      onChange({ ...config, extraParticipants: next });
                    }}
                    className="text-white/30 hover:text-rose-400 p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: DRAW & ANIMATION SETTINGS */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white">Live Draw & Animation Controls</h2>
              <p className="text-xs text-white/50">
                Configure timing, winner counts, sound effects, and celebratory animations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Winner Count Card */}
              <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  <span>Number of Winners in Active Draw</span>
                </div>
                <p className="text-xs text-white/60">
                  Select how many winner slots appear on the live draw screen (1 to {config.winners.length}).
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  {Array.from({ length: Math.min(8, config.winners.length) }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        onClick={() => {
                          updateField('winnerCount', num);
                          sound.playClick();
                        }}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          config.winnerCount === num
                            ? 'bg-[#e60039] text-white shadow-lg shadow-rose-600/30'
                            : 'bg-[#0d0d10] border border-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Countdown Timer Duration */}
              <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  <span>Live Countdown Duration</span>
                </div>
                <p className="text-xs text-white/60">
                  Total seconds the live draw countdown runs before revealing winners.
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  {[3, 5, 8, 10, 15].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        updateField('countdownSeconds', sec);
                        sound.playClick();
                      }}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        config.countdownSeconds === sec
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                          : 'bg-[#0d0d10] border border-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Test Panel */}
              <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 space-y-3 md:col-span-2">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Volume2 className="w-4 h-4" />
                  <span>Sound Effects Library</span>
                </div>
                <p className="text-xs text-white/60">
                  Synthesized Web Audio sound effects triggered during interactions and draw wins.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => sound.playClick()}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 border border-white/5"
                  >
                    🔊 Test Click Sound
                  </button>
                  <button
                    onClick={() => sound.playShuffle()}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 border border-white/5"
                  >
                    🎲 Test Shuffle Sound
                  </button>
                  <button
                    onClick={() => sound.playTick(600)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 border border-white/5"
                  >
                    ⏱️ Test Countdown Tick
                  </button>
                  <button
                    onClick={() => sound.playWin()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30"
                  >
                    🎉 Test Winner Celebration Chime
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: EXPORT & CODE SYNC */}
        {/* ============================================================ */}
        {activeTab === 'export' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-3 gap-2">
              <div>
                <h2 className="text-base font-bold text-white">Export & Code Sync</h2>
                <p className="text-xs text-white/50">
                  Sync configuration directly to <code className="text-rose-400">src/media/giveawayData.ts</code> or export JSON backups.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetDefaults}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-600/20 text-white/70 hover:text-rose-400 text-xs font-medium transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleCopyTypeScript}
                className="p-4 rounded-2xl bg-[#141418] border border-white/10 hover:border-rose-500/50 flex flex-col items-start space-y-2 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {copiedCode ? 'Copied TypeScript!' : 'Copy giveawayData.ts Code'}
                  </div>
                  <div className="text-[10px] text-white/50">
                    Paste directly into src/media/giveawayData.ts
                  </div>
                </div>
              </button>

              <button
                onClick={handleCopyJson}
                className="p-4 rounded-2xl bg-[#141418] border border-white/10 hover:border-rose-500/50 flex flex-col items-start space-y-2 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {copiedJson ? 'Copied JSON!' : 'Copy JSON Configuration'}
                  </div>
                  <div className="text-[10px] text-white/50">
                    Save as JSON snippet
                  </div>
                </div>
              </button>

              <label className="p-4 rounded-2xl bg-[#141418] border border-white/10 hover:border-rose-500/50 flex flex-col items-start space-y-2 text-left transition-all cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJson}
                />
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Import JSON Config</div>
                  <div className="text-[10px] text-white/50">Load saved JSON configuration file</div>
                </div>
              </label>
            </div>

            {/* Generated Code Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/80">
                  Generated <code className="text-rose-400">src/media/giveawayData.ts</code> Code:
                </label>
                <button
                  onClick={handleCopyTypeScript}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
                {generateTypeScriptCode(config)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Save Notification Banner */}
      {saveToast && (
        <div className="bg-emerald-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Giveaway configuration saved and applied successfully!</span>
        </div>
      )}
    </div>
  );
};
