'use client';

import { motion } from 'framer-motion';
import type { MuscleFilter } from '@/features/exercises/hooks/useExercises';

const FILTERS: { label: string; value: MuscleFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Chest', value: 'chest' },
  { label: 'Back', value: 'back' },
  { label: 'Legs', value: 'legs' },
  { label: 'Shoulders', value: 'shoulders' },
  { label: 'Arms', value: 'arms' },
  { label: 'Core', value: 'core' },
];

interface MuscleFilterProps {
  value: MuscleFilter;
  onChange: (v: MuscleFilter) => void;
}

export function MuscleFilterBar({ value, onChange }: MuscleFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {FILTERS.map((f) => {
        const active = value === f.value;
        return (
          <motion.button
            key={f.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(f.value)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: active ? 'var(--primary)' : 'var(--card)',
              color: active ? '#000' : 'var(--secondary)',
              border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
            }}
          >
            {f.label}
          </motion.button>
        );
      })}
    </div>
  );
}
