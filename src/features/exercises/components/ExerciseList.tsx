'use client';

import { Search, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import { ExerciseCard } from './ExerciseCard';
import { MuscleFilterBar } from './MuscleFilter';
import { useExercises } from '@/features/exercises/hooks/useExercises';

export function ExerciseList() {
  const { exercises, filter, setFilter, search, setSearch } = useExercises();

  // Get last set and PR for each exercise
  const allSets = useLiveQuery(() => db.loggedSets.toArray(), []);

  function getStats(exerciseId: string) {
    if (!allSets) return {};
    const sets = allSets.filter((s) => s.exerciseId === exerciseId);
    if (sets.length === 0) return {};
    const sorted = [...sets].sort((a, b) => b.loggedAt - a.loggedAt);
    const last = sorted[0];
    const pr = sets.reduce((best, s) => (s.weightKg > (best?.weightKg ?? -1) ? s : best), null as typeof sets[0] | null);
    return { lastWeight: last.weightKg, lastReps: last.reps, prWeight: pr?.weightKg, prReps: pr?.reps };
  }

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        background: 'var(--background)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Exercises</h1>
        <Link href="/settings">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Settings size={20} style={{ color: 'var(--secondary)' }} />
          </motion.div>
        </Link>
      </div>

      {/* Exercise list */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar px-4"
        style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col gap-3 pt-2">
          {exercises.length === 0 ? (
            <p className="text-center py-12 text-sm" style={{ color: 'var(--secondary)' }}>
              No exercises found
            </p>
          ) : (
            exercises.map((ex) => {
              const stats = getStats(ex.id);
              return (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  {...stats}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Sticky filter/search bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 px-4 pt-3"
        style={{
          paddingBottom: 'calc(64px + env(safe-area-inset-bottom) + 8px)',
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <MuscleFilterBar value={filter} onChange={setFilter} />
        <div className="relative mt-2">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--secondary)' }}
          />
          <input
            type="text"
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--primary)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
