'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Exercise } from '@/core/db/database';

const MUSCLE_LABELS: Record<Exercise['muscleGroup'], string> = {
  chest: 'Chest',
  back: 'Back',
  legs: 'Legs',
  shoulders: 'Shoulders',
  arms: 'Arms',
  core: 'Core',
};

interface ExerciseCardProps {
  exercise: Exercise;
  lastWeight?: number;
  lastReps?: number;
  prWeight?: number;
  prReps?: number;
}

export function ExerciseCard({ exercise, lastWeight, lastReps, prWeight, prReps }: ExerciseCardProps) {
  return (
    <Link href={`/exercises/${exercise.id}`}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="rounded-2xl px-4 py-3.5"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-base" style={{ color: 'var(--primary)' }}>
            {exercise.name}
          </p>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'var(--surface)', color: 'var(--secondary)' }}
          >
            {MUSCLE_LABELS[exercise.muscleGroup]}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {lastWeight !== undefined ? (
            <p className="text-sm" style={{ color: 'var(--secondary)' }}>
              Last:{' '}
              <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                {lastWeight}kg × {lastReps}
              </span>
            </p>
          ) : (
            <p className="text-sm" style={{ color: 'var(--secondary)' }}>No history yet</p>
          )}
          {prWeight !== undefined && (
            <p className="text-sm" style={{ color: 'var(--secondary)' }}>
              PR:{' '}
              <span className="font-semibold" style={{ color: 'var(--accent-green)' }}>
                {prWeight}kg × {prReps}
              </span>
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
