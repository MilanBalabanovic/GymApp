'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface PhotoSliderProps {
  firstUrl: string;
  lastUrl: string;
}

export function PhotoSlider({ firstUrl, lastUrl }: PhotoSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ aspectRatio: '4/3', background: 'var(--card)', border: '1px solid var(--border)' }}
      onMouseMove={(e) => updatePosition(e.clientX)}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* Right (recent) image — full */}
      <img
        src={lastUrl}
        alt="Most recent"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Left (first) image — clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={firstUrl}
          alt="First"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${(100 / position) * 100}%`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>
      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5"
        style={{
          left: `${position}%`,
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.8)',
        }}
      >
        {/* Handle */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
          whileTap={{ scale: 1.1 }}
        >
          <span className="text-black text-xs font-bold">⇔</span>
        </motion.div>
      </div>
      {/* Labels */}
      <div className="absolute bottom-2 left-3">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
          Before
        </span>
      </div>
      <div className="absolute bottom-2 right-3">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
          Now
        </span>
      </div>
    </div>
  );
}

interface PhotoPlaceholderProps {
  onAddPhoto: (dataUrl: string) => void;
}

export function PhotoPlaceholder({ onAddPhoto }: PhotoPlaceholderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAddPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="w-full rounded-2xl flex flex-col items-center justify-center gap-3"
      style={{
        aspectRatio: '4/3',
        background: 'var(--card)',
        border: '1px dashed var(--border)',
      }}
    >
      <p className="text-sm" style={{ color: 'var(--secondary)' }}>Track your progress visually</p>
      <label>
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
          style={{ background: 'var(--primary)', color: '#000' }}
        >
          Take First Photo
        </motion.div>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
