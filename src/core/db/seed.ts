import { db } from './database';
import type { Exercise } from './database';

const DEFAULT_EXERCISES: Omit<Exercise, 'id' | 'createdAt'>[] = [
  // Chest
  { name: 'Bench Press', muscleGroup: 'chest', isCustom: false },
  { name: 'Incline Bench Press', muscleGroup: 'chest', isCustom: false },
  { name: 'Cable Fly', muscleGroup: 'chest', isCustom: false },
  { name: 'Dumbbell Fly', muscleGroup: 'chest', isCustom: false },
  { name: 'Push-up', muscleGroup: 'chest', isCustom: false },
  // Back
  { name: 'Deadlift', muscleGroup: 'back', isCustom: false },
  { name: 'Pull-up', muscleGroup: 'back', isCustom: false },
  { name: 'Barbell Row', muscleGroup: 'back', isCustom: false },
  { name: 'Cable Row', muscleGroup: 'back', isCustom: false },
  { name: 'Lat Pulldown', muscleGroup: 'back', isCustom: false },
  // Legs
  { name: 'Squat', muscleGroup: 'legs', isCustom: false },
  { name: 'Leg Press', muscleGroup: 'legs', isCustom: false },
  { name: 'Romanian Deadlift', muscleGroup: 'legs', isCustom: false },
  { name: 'Leg Curl', muscleGroup: 'legs', isCustom: false },
  { name: 'Leg Extension', muscleGroup: 'legs', isCustom: false },
  { name: 'Calf Raise', muscleGroup: 'legs', isCustom: false },
  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'shoulders', isCustom: false },
  { name: 'Lateral Raise', muscleGroup: 'shoulders', isCustom: false },
  { name: 'Face Pull', muscleGroup: 'shoulders', isCustom: false },
  { name: 'Arnold Press', muscleGroup: 'shoulders', isCustom: false },
  // Arms
  { name: 'Bicep Curl', muscleGroup: 'arms', isCustom: false },
  { name: 'Hammer Curl', muscleGroup: 'arms', isCustom: false },
  { name: 'Tricep Pushdown', muscleGroup: 'arms', isCustom: false },
  { name: 'Skull Crusher', muscleGroup: 'arms', isCustom: false },
  { name: 'Dips', muscleGroup: 'arms', isCustom: false },
  // Core
  { name: 'Plank', muscleGroup: 'core', isCustom: false },
  { name: 'Cable Crunch', muscleGroup: 'core', isCustom: false },
  { name: 'Hanging Leg Raise', muscleGroup: 'core', isCustom: false },
];

export async function seedDatabase(): Promise<void> {
  const count = await db.exercises.count();
  if (count > 0) return;

  const now = Date.now();
  const exercises: Exercise[] = DEFAULT_EXERCISES.map((e, i) => ({
    ...e,
    id: `exercise-default-${i}`,
    createdAt: now,
  }));

  await db.exercises.bulkAdd(exercises);
}

export async function isWeeklyPlanConfigured(): Promise<boolean> {
  const plan = await db.weeklyPlan.toArray();
  return plan.some((p) => p.templateId !== null);
}
