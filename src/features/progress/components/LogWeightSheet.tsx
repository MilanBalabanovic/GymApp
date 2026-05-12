'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BottomSheet } from '@/core/components/BottomSheet';
import { DrumrollPicker, BODYWEIGHT_VALUES } from '@/core/components/DrumrollPicker';

interface LogWeightSheetProps {
  open: boolean;
  onClose: () => void;
  onLog: (weight: number) => void;
}

export function LogWeightSheet({ open, onClose, onLog }: LogWeightSheetProps) {
  const [weight, setWeight] = useState(75);

  const handleConfirm = () => {
    onLog(weight);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Log Weight">
      <div className="px-4 pb-4 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <DrumrollPicker
            values={BODYWEIGHT_VALUES}
            value={weight}
            onChange={setWeight}
            formatValue={(v) => v.toFixed(1)}
          />
          <p className="text-xl font-semibold" style={{ color: 'var(--secondary)' }}>kg</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl text-base font-bold"
          style={{ background: 'var(--primary)', color: '#000' }}
        >
          Log Weight
        </motion.button>
      </div>
    </BottomSheet>
  );
}
