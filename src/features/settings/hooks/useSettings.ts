'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import type { Exercise, Template, TemplateExercise } from '@/core/db/database';

export function useWeeklyPlan() {
  const plan = useLiveQuery(() => db.weeklyPlan.toArray(), []);
  const templates = useLiveQuery(() => db.templates.orderBy('createdAt').toArray(), []);

  const setDayTemplate = useCallback(async (dayOfWeek: number, templateId: string | null) => {
    await db.weeklyPlan.put({ dayOfWeek, templateId });
  }, []);

  const planMap = new Map((plan ?? []).map((p) => [p.dayOfWeek, p.templateId]));
  const templateMap = new Map((templates ?? []).map((t) => [t.id, t]));

  return { plan: plan ?? [], planMap, templates: templates ?? [], templateMap, setDayTemplate };
}

export function useTemplates() {
  const templates = useLiveQuery(() => db.templates.orderBy('createdAt').toArray(), []);
  const templateExercises = useLiveQuery(() => db.templateExercises.toArray(), []);
  const exercises = useLiveQuery(() => db.exercises.orderBy('name').toArray(), []);

  const createTemplate = useCallback(async (name: string) => {
    const id = `tmpl-${Date.now()}`;
    await db.templates.add({ id, name, createdAt: Date.now() });
    return id;
  }, []);

  const renameTemplate = useCallback(async (id: string, name: string) => {
    await db.templates.update(id, { name });
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    await db.transaction('rw', db.templates, db.templateExercises, db.weeklyPlan, async () => {
      await db.templates.delete(id);
      await db.templateExercises.where('templateId').equals(id).delete();
      const plans = await db.weeklyPlan.where('templateId').equals(id).toArray();
      for (const p of plans) {
        await db.weeklyPlan.put({ dayOfWeek: p.dayOfWeek, templateId: null });
      }
    });
  }, []);

  const addExerciseToTemplate = useCallback(async (templateId: string, exerciseId: string, defaultSets = 3) => {
    const existing = await db.templateExercises
      .where('templateId').equals(templateId)
      .toArray();
    const order = existing.length;
    await db.templateExercises.add({
      id: `te-${Date.now()}`,
      templateId,
      exerciseId,
      orderIndex: order,
      defaultSets,
    });
  }, []);

  const removeExerciseFromTemplate = useCallback(async (id: string) => {
    await db.templateExercises.delete(id);
  }, []);

  const updateDefaultSets = useCallback(async (id: string, defaultSets: number) => {
    await db.templateExercises.update(id, { defaultSets });
  }, []);

  const getTemplateExercises = useCallback((templateId: string): TemplateExercise[] => {
    return (templateExercises ?? [])
      .filter((te) => te.templateId === templateId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [templateExercises]);

  return {
    templates: templates ?? [],
    exercises: exercises ?? [],
    templateExercises: templateExercises ?? [],
    getTemplateExercises,
    createTemplate,
    renameTemplate,
    deleteTemplate,
    addExerciseToTemplate,
    removeExerciseFromTemplate,
    updateDefaultSets,
  };
}

export function useExerciseManager() {
  const exercises = useLiveQuery(() => db.exercises.orderBy('name').toArray(), []);

  const addExercise = useCallback(async (name: string, muscleGroup: Exercise['muscleGroup']) => {
    await db.exercises.add({
      id: `ex-custom-${Date.now()}`,
      name,
      muscleGroup,
      isCustom: true,
      createdAt: Date.now(),
    });
  }, []);

  const updateExercise = useCallback(async (id: string, updates: Partial<Pick<Exercise, 'name' | 'muscleGroup'>>) => {
    await db.exercises.update(id, updates);
  }, []);

  const deleteExercise = useCallback(async (id: string) => {
    await db.transaction('rw', db.exercises, db.templateExercises, async () => {
      await db.exercises.delete(id);
      await db.templateExercises.where('exerciseId').equals(id).delete();
    });
  }, []);

  const grouped = (exercises ?? []).reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) acc[ex.muscleGroup] = [];
    acc[ex.muscleGroup].push(ex);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return { exercises: exercises ?? [], grouped, addExercise, updateExercise, deleteExercise };
}
