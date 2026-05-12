'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheet } from '@/core/components/BottomSheet';
import { ExerciseBlock } from './ExerciseBlock';
import { useActiveSession } from '@/features/workout/hooks/useActiveSession';
import { useHaptics } from '@/core/hooks/useHaptics';

function useElapsedTimer(startedAt: number | null) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) return;
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ActiveSession() {
  const session = useActiveSession();
  const haptics = useHaptics();
  const [finishOpen, setFinishOpen] = useState(false);
  const elapsed = useElapsedTimer(session.startedAt);

  const handleFinish = async () => {
    await session.finishSession();
    setFinishOpen(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 z-20"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
          paddingBottom: 12,
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <p className="font-semibold text-base truncate max-w-[180px]" style={{ color: 'var(--primary)' }}>
          {session.templateName}
        </p>
        <p className="font-mono text-base tabular-nums" style={{ color: 'var(--secondary)' }}>
          {elapsed}
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { haptics.light(); setFinishOpen(true); }}
          className="px-4 py-1.5 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--accent-green)', color: '#000' }}
        >
          Finish
        </motion.button>
      </div>

      {/* Snap-scroll exercise blocks */}
      <div
        className="snap-container flex-1"
        style={{ overflowY: 'scroll', scrollSnapType: 'y mandatory' }}
      >
        {session.exercises.map((ex, i) => (
          <div key={ex.exerciseId} className="snap-child" style={{ height: '100vh' }}>
            <ExerciseBlock
              exerciseData={ex}
              index={i}
              totalCount={session.exercises.length}
            />
          </div>
        ))}
      </div>

      {/* Finish bottom sheet */}
      <BottomSheet open={finishOpen} onClose={() => setFinishOpen(false)} title="Finish Workout">
        <div className="px-4 pb-4">
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums" style={{ color: 'var(--primary)' }}>
                  {session.exerciseCount}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--secondary)' }}>
                  Exercises
                </p>
              </div>
              <div className="w-px" style={{ background: 'var(--border)' }} />
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums" style={{ color: 'var(--primary)' }}>
                  {session.totalConfirmedSets}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--secondary)' }}>
                  Sets
                </p>
              </div>
              <div className="w-px" style={{ background: 'var(--border)' }} />
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums font-mono" style={{ color: 'var(--primary)' }}>
                  {elapsed}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--secondary)' }}>
                  Time
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleFinish}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ background: 'var(--accent-green)', color: '#000' }}
          >
            Save Workout
          </motion.button>
        </div>
      </BottomSheet>
    </div>
  );
}
