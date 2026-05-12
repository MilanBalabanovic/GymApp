'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { BottomSheet } from '@/core/components/BottomSheet';
import { PhotoSlider, PhotoPlaceholder } from './PhotoSlider';
import { BodyweightChart } from './BodyweightChart';
import { LogWeightSheet } from './LogWeightSheet';
import { useBodyweight, useProgressPhotos } from '@/features/progress/hooks/useBodyweight';

export function ProgressView() {
  const { chartData, logWeight } = useBodyweight();
  const { first, last, addPhoto } = useProgressPhotos();
  const [fabOpen, setFabOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = (dataUrl: string) => addPhoto(dataUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => addPhoto(reader.result as string);
    reader.readAsDataURL(file);
    setFabOpen(false);
  };

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        background: 'var(--background)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Progress</h1>
        <Link href="/settings">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Settings size={20} style={{ color: 'var(--secondary)' }} />
          </motion.div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 flex flex-col gap-5 pt-2">
        {/* Photo slider */}
        {first && last ? (
          <PhotoSlider firstUrl={first.dataUrl} lastUrl={last.dataUrl} />
        ) : first ? (
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img src={first.dataUrl} alt="First photo" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                Add another photo to compare
              </span>
            </div>
          </div>
        ) : (
          <PhotoPlaceholder onAddPhoto={handleAddPhoto} />
        )}

        {/* Bodyweight chart */}
        <BodyweightChart data={chartData} />
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setFabOpen(true)}
        className="fixed w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-20"
        style={{
          bottom: 'calc(72px + env(safe-area-inset-bottom))',
          right: 20,
          background: 'var(--primary)',
        }}
      >
        <Plus size={24} color="#000" />
      </motion.button>

      {/* FAB bottom sheet */}
      <BottomSheet open={fabOpen} onClose={() => setFabOpen(false)} title="Add">
        <div className="px-4 pb-4 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setFabOpen(false); setTimeout(() => setWeightOpen(true), 100); }}
            className="flex items-center gap-4 w-full rounded-2xl px-5 py-4 text-left"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <span className="text-xl">⚖️</span>
            <p className="font-semibold text-base" style={{ color: 'var(--primary)' }}>Log Weight</p>
          </motion.button>
          <label>
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 w-full rounded-2xl px-5 py-4 text-left cursor-pointer"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <span className="text-xl">📷</span>
              <p className="font-semibold text-base" style={{ color: 'var(--primary)' }}>Add Photo</p>
            </motion.div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </BottomSheet>

      <LogWeightSheet
        open={weightOpen}
        onClose={() => setWeightOpen(false)}
        onLog={logWeight}
      />
    </div>
  );
}
