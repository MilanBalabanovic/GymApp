'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import { useSessionStore } from '@/features/workout/store/sessionStore';
import { useHaptics } from '@/core/hooks/useHaptics';
import { SetRow } from './SetRow';
import type { ActiveExercise } from '@/features/workout/store/sessionStore';

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#E57373',
  back: '#64B5F6',
  legs: '#81C784',
  shoulders: '#FFB74D',
  arms: '#CE93D8',
  core: '#4DD0E1',
};

interface ExerciseBlockProps {
  exerciseData: ActiveExercise;
  index: number;
  totalCount: number;
}

export function ExerciseBlock({ exerciseData, index, totalCount }: ExerciseBlockProps) {
  const store = useSessionStore();
  const haptics = useHaptics();

  const exercise = useLiveQuery(
    () => db.exercises.get(exerciseData.exerciseId),
    [exerciseData.exerciseId]
  );

  if (!exercise) return null;

  const muscleColor = MUSCLE_COLORS[exercise.muscleGroup] ?? 'var(--secondary)';

  return (
    <div
      className="snap-child flex flex-col"
      style={{
        height: '100%',
        minHeight: 0,
        paddingTop: 'calc(64px + env(safe-area-inset-top))',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex-1 overflow-y-auto no-scrollbar px-4">
        {/* Exercise header */}
        <div className="pt-2 pb-4">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="font-bold text-2xl" style={{ color: 'var(--primary)' }}>
              {exercise.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
              style={{ background: `${muscleColor}22`, color: muscleColor }}
            >
              {exercise.muscleGroup}
            </span>
            <span className="text-xs" style={{ color: 'var(--secondary)' }}>
              {index + 1} / {totalCount}
            </span>
          </div>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-3 mb-2 px-0">
          <div className="w-12 flex-shrink-0" />
          <div className="flex-1 flex items-center gap-2">
            <div className="w-20 text-center">
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>Weight</p>
            </div>
            <div className="w-4" />
            <div className="w-20 text-center">
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>Reps</p>
            </div>
          </div>
        </div>

        {/* Sets */}
        <div className="flex flex-col gap-3">
          {exerciseData.sets.map((setRow) => (
            <SetRow
              key={setRow.id}
              set={setRow}
              onConfirm={(id, w, r) => store.confirmSet(exerciseData.exerciseId, id, w, r)}
              onAddDropSet={(id) => { haptics.light(); store.addDropSet(exerciseData.exerciseId, id); }}
              onRemove={(id) => store.removeSet(exerciseData.exerciseId, id)}
              onWeightChange={(id, v) => store.updateSetValue(exerciseData.exerciseId, id, 'weightKg', v)}
              onRepsChange={(id, v) => store.updateSetValue(exerciseData.exerciseId, id, 'reps', v)}
            />
          ))}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
