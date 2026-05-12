'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import type { Exercise } from '@/core/db/database';

export type MuscleFilter = 'all' | Exercise['muscleGroup'];

export function useExercises() {
  const [filter, setFilter] = useState<MuscleFilter>('all');
  const [search, setSearch] = useState('');

  const exercises = useLiveQuery(async () => {
    let query = db.exercises.orderBy('name');
    const all = await query.toArray();
    return all.filter((e) => {
      const matchesMuscle = filter === 'all' || e.muscleGroup === filter;
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
      return matchesMuscle && matchesSearch;
    });
  }, [filter, search]);

  return { exercises: exercises ?? [], filter, setFilter, search, setSearch };
}

export function useExerciseHistory(exerciseId: string) {
  return useLiveQuery(async () => {
    const sets = await db.loggedSets
      .where('exerciseId')
      .equals(exerciseId)
      .sortBy('loggedAt');

    const sessions = await db.sessions.toArray();
    const sessionMap = new Map(sessions.map((s) => [s.id, s]));

    // Group by session
    const grouped = new Map<string, typeof sets>();
    for (const set of sets) {
      if (!grouped.has(set.sessionId)) grouped.set(set.sessionId, []);
      grouped.get(set.sessionId)!.push(set);
    }

    // Build chart data: max weight per session
    const chartData = Array.from(grouped.entries())
      .map(([sid, setSets]) => {
        const session = sessionMap.get(sid);
        return {
          date: session?.startedAt ?? 0,
          maxWeight: Math.max(...setSets.map((s) => s.weightKg)),
        };
      })
      .sort((a, b) => a.date - b.date)
      .slice(-30);

    const history = Array.from(grouped.entries())
      .map(([sid, setSets]) => {
        const session = sessionMap.get(sid);
        return { sessionId: sid, date: session?.startedAt ?? 0, sets: setSets };
      })
      .sort((a, b) => b.date - a.date);

    const pr = sets.reduce(
      (best, s) =>
        s.weightKg > (best?.weightKg ?? -1) ? s : best,
      null as typeof sets[0] | null
    );

    const lastSet = sets[sets.length - 1] ?? null;

    return { chartData, history, pr, lastSet };
  }, [exerciseId]);
}
