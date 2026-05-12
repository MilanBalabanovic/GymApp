'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DrumrollPicker, WEIGHT_VALUES, REPS_VALUES } from '@/core/components/DrumrollPicker';
import { DeviationSheet } from './DeviationSheet';
import { useHaptics } from '@/core/hooks/useHaptics';
import type { ActiveSetRow } from '@/features/workout/store/sessionStore';

interface SetRowProps {
  set: ActiveSetRow;
  onConfirm: (setId: string, weight: number, reps: number) => void;
  onAddDropSet: (setId: string) => void;
  onRemove: (setId: string) => void;
  onWeightChange: (setId: string, value: number) => void;
  onRepsChange: (setId: string, value: number) => void;
}

export function SetRow({ set, onConfirm, onAddDropSet, onRemove, onWeightChange, onRepsChange }: SetRowProps) {
  const [deviationOpen, setDeviationOpen] = useState(false);
  const haptics = useHaptics();

  const handleWeightChange = (v: number) => onWeightChange(set.id, v);
  const handleRepsChange = (v: number) => onRepsChange(set.id, v);

  const handleConfirm = () => {
    if (set.confirmed) return;
    haptics.medium();
    onConfirm(set.id, set.weightKg, set.reps);
  };

  const isDropset = set.setType === 'dropset';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex items-center gap-3 ${isDropset ? 'pl-6' : ''}`}
      >
        {/* Set label */}
        <div className="w-12 flex-shrink-0">
          {isDropset ? (
            <p className="text-xs font-medium" style={{ color: 'var(--accent-green)' }}>
              ↳ Drop {set.dropsetIndex}
            </p>
          ) : (
            <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--secondary)' }}>
              Set {set.setNumber}
            </p>
          )}
        </div>

        {/* Pickers */}
        <div className="flex-1 flex items-center gap-2">
          <div className={`rounded-xl overflow-hidden ${set.confirmed ? 'opacity-50' : ''}`}
            style={{ background: 'var(--surface)' }}>
            <DrumrollPicker
              values={WEIGHT_VALUES}
              value={set.weightKg}
              onChange={handleWeightChange}
              formatValue={(v) => v === 0 ? '0' : `${v}`}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--secondary)' }}>kg</p>
          <div className={`rounded-xl overflow-hidden ${set.confirmed ? 'opacity-50' : ''}`}
            style={{ background: 'var(--surface)' }}>
            <DrumrollPicker
              values={REPS_VALUES}
              value={set.reps}
              onChange={handleRepsChange}
              formatValue={(v) => `${v}`}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--secondary)' }}>reps</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!set.confirmed && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleConfirm}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--accent-green)' }}
            >
              <span className="text-black text-sm font-bold">✓</span>
            </motion.button>
          )}
          {set.confirmed && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(76,175,80,0.2)' }}>
              <span className="text-sm" style={{ color: 'var(--accent-green)' }}>✓</span>
            </div>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { haptics.light(); setDeviationOpen(true); }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface)' }}
          >
            <span className="text-xs" style={{ color: 'var(--secondary)' }}>•••</span>
          </motion.button>
        </div>
      </motion.div>

      <DeviationSheet
        open={deviationOpen}
        onClose={() => setDeviationOpen(false)}
        onAddDropSet={() => onAddDropSet(set.id)}
        onRemoveSet={() => onRemove(set.id)}
      />
    </>
  );
}
