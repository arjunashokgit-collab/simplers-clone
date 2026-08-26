import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, Trash2, Sparkles, FolderOpen } from 'lucide-react';
import { fileToDataUrl } from '../utils/configStorage';
import { PresetImage, POST_IMAGE_PRESETS, AVATAR_PRESETS } from '../utils/mediaPresets';
import { sound } from '../utils/audio';

interface MediaUploaderProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (url: string) => void;
  type?: 'avatar' | 'post' | 'general';
  aspectRatio?: 'square' | 'video' | 'circle';
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  sublabel,
  value,
  onChange,
  type = 'general',
  aspectRatio = 'square',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [inputUrl, setInputUrl] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const presets = type === 'avatar' ? AVATAR_PRESETS : POST_IMAGE_PRESETS;

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, GIF, SVG)');
      return;
    }

    try {
      setIsLoading(true);
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
      setInputUrl(dataUrl);
      try {
        sound.playClick();
      } catch {}
    } catch (err) {
      console.error('File reading failed:', err);
      alert('Failed to load image file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleUrlApply = () => {
    if (inputUrl.trim()) {
      onChange(inputUrl.trim());
      try {
        sound.playClick();
      } catch {}
    }
  };

  const getAspectClass = () => {
    if (aspectRatio === 'circle') return 'w-20 h-20 rounded-full';
    if (aspectRatio === 'video') return 'w-full aspect-[16/9] rounded-2xl';
    return 'w-24 h-24 rounded-2xl';
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-white/90 block">{label}</label>
          {sublabel && <p className="text-[11px] text-white/50">{sublabel}</p>}
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center space-x-1 bg-black/40 border border-white/10 rounded-lg p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-1 rounded-md font-medium transition-all ${
              mode === 'upload'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-1 rounded-md font-medium transition-all ${
              mode === 'url'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Image URL
          </button>
          <button
            type="button"
            onClick={() => setMode('presets')}
            className={`px-2 py-1 rounded-md font-medium transition-all ${
              mode === 'presets'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Presets
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#141418] border border-white/10 rounded-2xl p-3 space-y-3">
        {/* Active Mode Input Area */}
        {mode === 'upload' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
              isDragging
                ? 'border-rose-500 bg-rose-500/10 scale-[1.01]'
                : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-white/90">
              Click to choose image or drag & drop here
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">
              Supports JPG, PNG, WebP, GIF, SVG (Saved directly in your browser)
            </p>
          </div>
        )}

        {mode === 'url' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Paste image web link (https://...)"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlApply()}
                  className="w-full bg-[#0d0d10] border border-white/10 rounded-xl pl-8.5 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleUrlApply}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {mode === 'presets' && (
          <div className="space-y-2">
            <div className="text-[11px] text-white/60 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Choose from sample media presets:</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
              {presets.map((preset) => {
                const isSelected = value === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onChange(preset.url);
                      setInputUrl(preset.url);
                      try {
                        sound.playClick();
                      } catch {}
                    }}
                    className={`group relative rounded-xl overflow-hidden border transition-all text-left ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/40'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="aspect-square bg-black/40">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    )}
                    <div className="p-1 bg-[#121215] text-[9px] font-medium text-white/80 truncate">
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Image Preview & Details Strip */}
        {value && (
          <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl p-2.5">
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`${getAspectClass()} overflow-hidden bg-black/60 shrink-0 border border-white/10 relative`}>
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Media Loaded</span>
                  </span>
                </div>
                <p className="text-[10px] text-white/50 truncate font-mono mt-0.5">
                  {value.startsWith('data:') ? 'Local file (Base64)' : value}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setInputUrl('');
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600/20 text-white/50 hover:text-rose-400 transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
