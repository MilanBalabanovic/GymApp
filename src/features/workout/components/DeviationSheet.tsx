'use client';

import { motion } from 'framer-motion';
import { BottomSheet } from '@/core/components/BottomSheet';
import { useHaptics } from '@/core/hooks/useHaptics';

interface DeviationSheetProps {
  open: boolean;
  onClose: () => void;
  onAddDropSet: () => void;
  onRemoveSet: () => void;
}

export function DeviationSheet({ open, onClose, onAddDropSet, onRemoveSet }: DeviationSheetProps) {
  const haptics = useHaptics();

  const handleAddDropSet = () => {
    haptics.medium();
    onAddDropSet();
    onClose();
  };

  const handleRemove = () => {
    haptics.medium();
    onRemoveSet();
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Set Options">
      <div className="px-4 pb-4 flex flex-col gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddDropSet}
          className="flex items-center gap-4 w-full rounded-2xl px-5 py-4 text-left"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <span className="text-xl">↳</span>
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--primary)' }}>Add Drop Set</p>
            <p className="text-sm" style={{ color: 'var(--secondary)' }}>Continue with reduced weight</p>
          </div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRemove}
          className="flex items-center gap-4 w-full rounded-2xl px-5 py-4 text-left"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <span className="text-xl" style={{ color: 'var(--destructive)' }}>✕</span>
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--destructive)' }}>Remove Set</p>
            <p className="text-sm" style={{ color: 'var(--secondary)' }}>Delete this set</p>
          </div>
        </motion.button>
      </div>
    </BottomSheet>
  );
}
