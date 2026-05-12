'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import { useSessionStore, type ActiveExercise } from '@/features/workout/store/sessionStore';
import { useHaptics } from '@/core/hooks/useHaptics';
import type { TemplateExercise } from '@/core/db/database';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useActiveSession() {
  const store = useSessionStore();
  const haptics = useHaptics();

  const startSession = useCallback(
    async (templateId: string | null, templateName: string, templateExercises: TemplateExercise[]) => {
      const sessionId = generateId();

      // Build initial exercise blocks, pre-filling from last session
      const exercises: ActiveExercise[] = [];
      for (const te of templateExercises) {
        // Get last session values for this exercise
        const lastSets = await db.loggedSets
          .where('exerciseId')
          .equals(te.exerciseId)
          .sortBy('loggedAt');
        const lastSet = lastSets[lastSets.length - 1];
        const defaultWeight = lastSet?.weightKg ?? 0;
        const defaultReps = lastSet?.reps ?? 10;

        const sets = Array.from({ length: te.defaultSets }, (_, i) => ({
          id: `set-${sessionId}-${te.exerciseId}-${i}`,
          exerciseId: te.exerciseId,
          setNumber: i + 1,
          weightKg: defaultWeight,
          reps: defaultReps,
          setType: 'normal' as const,
          dropsetIndex: 0,
          parentSetId: null,
          confirmed: false,
        }));

        exercises.push({ exerciseId: te.exerciseId, sets });
      }

      store.startSession(sessionId, templateId, templateName, exercises);
    },
    [store]
  );

  const finishSession = useCallback(async () => {
    const { sessionId, templateId, startedAt, exercises } = store;
    if (!sessionId || !startedAt) return;

    haptics.heavy();

    await db.sessions.add({
      id: sessionId,
      templateId,
      startedAt,
      finishedAt: Date.now(),
    });

    const confirmedSets = exercises.flatMap((ex) =>
      ex.sets
        .filter((s) => s.confirmed)
        .map((s) => ({
          id: `ls-${generateId()}`,
          sessionId,
          exerciseId: ex.exerciseId,
          setNumber: s.setNumber,
          weightKg: s.weightKg,
          reps: s.reps,
          setType: s.setType,
          dropsetIndex: s.dropsetIndex,
          parentSetId: s.parentSetId,
          loggedAt: s.confirmed ? Date.now() : Date.now(),
        }))
    );

    if (confirmedSets.length > 0) {
      await db.loggedSets.bulkAdd(confirmedSets);
    }

    store.endSession();
  }, [store, haptics]);

  const exerciseCount = store.exercises.length;
  const totalConfirmedSets = store.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.confirmed).length,
    0
  );

  return { ...store, startSession, finishSession, exerciseCount, totalConfirmedSets };
}

export function useLastSessionValues(exerciseId: string) {
  return useLiveQuery(async () => {
    const sets = await db.loggedSets
      .where('exerciseId')
      .equals(exerciseId)
      .sortBy('loggedAt');
    if (sets.length === 0) return null;
    const last = sets[sets.length - 1];
    return { weightKg: last.weightKg, reps: last.reps };
  }, [exerciseId]);
}
