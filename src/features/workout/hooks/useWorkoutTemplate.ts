'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import { getDay } from 'date-fns';

export function useWorkoutTemplate() {
  const today = new Date();
  // date-fns getDay: 0=Sunday..6=Saturday, we need 1=Monday..7=Sunday
  const rawDay = getDay(today);
  const dayOfWeek = rawDay === 0 ? 7 : rawDay;

  const plan = useLiveQuery(() => db.weeklyPlan.get(dayOfWeek), [dayOfWeek]);
  const template = useLiveQuery(
    () => (plan?.templateId ? db.templates.get(plan.templateId) : undefined),
    [plan?.templateId]
  );
  const templateExercises = useLiveQuery(
    () =>
      plan?.templateId
        ? db.templateExercises.where('templateId').equals(plan.templateId).sortBy('orderIndex')
        : [],
    [plan?.templateId]
  );
  const allTemplates = useLiveQuery(() => db.templates.orderBy('createdAt').toArray(), []);

  return { plan, template, templateExercises, allTemplates, dayOfWeek };
}
