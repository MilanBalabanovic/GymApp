'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useHaptics } from '@/core/hooks/useHaptics';

interface DrumrollPickerProps {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  itemHeight?: number;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

export function DrumrollPicker({
  values,
  value,
  onChange,
  formatValue = (v) => String(v),
  itemHeight = ITEM_HEIGHT,
}: DrumrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const haptics = useHaptics();
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToIndex = useCallback(
    (index: number, smooth: boolean) => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTo({ top: index * itemHeight, behavior: smooth ? 'smooth' : 'instant' });
    },
    [itemHeight]
  );

  useEffect(() => {
    const index = values.indexOf(value);
    if (index >= 0) scrollToIndex(index, false);
  }, []); // only on mount

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    isScrollingRef.current = true;

    scrollTimeoutRef.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const index = Math.round(el.scrollTop / itemHeight);
      const clamped = Math.max(0, Math.min(index, values.length - 1));
      scrollToIndex(clamped, true);
      const newValue = values[clamped];
      if (newValue !== value) {
        haptics.light();
        onChange(newValue);
      }
      isScrollingRef.current = false;
    }, 80);
  }, [itemHeight, values, value, onChange, scrollToIndex, haptics]);

  const visibleHeight = itemHeight * VISIBLE_ITEMS;
  const padding = itemHeight * Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div
      className="relative select-none"
      style={{ height: visibleHeight, width: 80 }}
    >
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-10 rounded-lg"
        style={{
          top: padding,
          height: itemHeight,
          background: 'rgba(255,255,255,0.06)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      />
      {/* Fade overlays */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: padding,
          background: 'linear-gradient(to bottom, var(--card) 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: padding,
          background: 'linear-gradient(to top, var(--card) 0%, transparent 100%)',
        }}
      />
      <div
        ref={containerRef}
        className="drumroll-container absolute inset-0"
        onScroll={handleScroll}
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <div style={{ paddingTop: padding, paddingBottom: padding }}>
          {values.map((v, i) => {
            const dist = Math.abs(values.indexOf(value) - i);
            const opacity = dist === 0 ? 1 : dist === 1 ? 0.5 : 0.2;
            const scale = dist === 0 ? 1 : 0.85;
            return (
              <div
                key={v}
                className="drumroll-item flex items-center justify-center font-semibold tabular-nums transition-all duration-100"
                style={{
                  height: itemHeight,
                  fontSize: dist === 0 ? 22 : 16,
                  opacity,
                  transform: `scale(${scale})`,
                  color: 'var(--primary)',
                  scrollSnapAlign: 'center',
                }}
              >
                {formatValue(v)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const WEIGHT_VALUES = Array.from({ length: 121 }, (_, i) => i * 2.5); // 0–300 in 2.5 steps
export const REPS_VALUES = Array.from({ length: 50 }, (_, i) => i + 1); // 1–50
export const BODYWEIGHT_VALUES = Array.from({ length: 2201 }, (_, i) =>
  Math.round((30 + i * 0.1) * 10) / 10
); // 30–250 in 0.1 steps
