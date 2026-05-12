'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BottomSheet } from '@/core/components/BottomSheet';
import { useWorkoutTemplate } from '@/features/workout/hooks/useWorkoutTemplate';
import { useActiveSession } from '@/features/workout/hooks/useActiveSession';
import { useHaptics } from '@/core/hooks/useHaptics';
import { Settings } from 'lucide-react';
import Link from 'next/link';

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WorkoutHome() {
  const { template, templateExercises, allTemplates, dayOfWeek } = useWorkoutTemplate();
  const session = useActiveSession();
  const haptics = useHaptics();
  const [changeOpen, setChangeOpen] = useState(false);

  const noTemplatesExist = allTemplates !== undefined && allTemplates.length === 0;

  const handleStart = async (overrideTemplateId?: string | null) => {
    const tid = overrideTemplateId !== undefined ? overrideTemplateId : (template?.id ?? null);
    const tname = allTemplates?.find((t) => t.id === tid)?.name ?? template?.name ?? 'Workout';
    const texercises = overrideTemplateId
      ? await import('@/core/db/database').then(({ db }) =>
          db.templateExercises.where('templateId').equals(overrideTemplateId).sortBy('orderIndex')
        )
      : templateExercises ?? [];

    haptics.heavy();
    setChangeOpen(false);
    await session.startSession(tid, tname, texercises);
  };

  const today = DAY_NAMES[dayOfWeek];

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom))',
        background: 'var(--background)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
            {today}
          </p>
        </div>
        <Link href="/settings">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Settings size={20} style={{ color: 'var(--secondary)' }} />
          </motion.div>
        </Link>
      </div>

      {/* First-launch banner */}
      {noTemplatesExist && (
        <Link href="/settings">
          <div
            className="mx-4 mb-2 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
              Set up your weekly plan to get started
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--accent-green)' }}>
              Go to Settings →
            </p>
          </div>
        </Link>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-8">
        <div className="text-center">
          {template ? (
            <>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>
                Today&apos;s Workout
              </p>
              <h1 className="text-4xl font-bold mb-1" style={{ color: 'var(--primary)' }}>
                {template.name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--secondary)' }}>
                {templateExercises?.length ?? 0} exercises
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                No workout today
              </h1>
              <p className="text-sm" style={{ color: 'var(--secondary)' }}>
                Rest day or start anyway
              </p>
            </>
          )}
        </div>

        <div className="w-full flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleStart()}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ background: 'var(--primary)', color: '#000' }}
          >
            Start Workout
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { haptics.light(); setChangeOpen(true); }}
            className="w-full py-2 text-sm font-medium"
            style={{ color: 'var(--secondary)' }}
          >
            Change
          </motion.button>
        </div>
      </div>

      {/* Change template sheet */}
      <BottomSheet open={changeOpen} onClose={() => setChangeOpen(false)} title="Select Workout">
        <div className="px-4 pb-4 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleStart(null)}
            className="flex items-center w-full rounded-2xl px-5 py-4 text-left"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <p className="font-semibold" style={{ color: 'var(--secondary)' }}>Free Session</p>
          </motion.button>
          {(allTemplates ?? []).map((t) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleStart(t.id)}
              className="flex items-center w-full rounded-2xl px-5 py-4 text-left"
              style={{
                background: 'var(--card)',
                border: `1px solid ${t.id === template?.id ? 'var(--accent-green)' : 'var(--border)'}`,
              }}
            >
              <p className="font-semibold" style={{ color: 'var(--primary)' }}>{t.name}</p>
            </motion.button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
