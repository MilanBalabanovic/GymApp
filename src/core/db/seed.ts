import { db } from './database';

export async function seedDatabase(): Promise<void> {
  // No default exercises — user adds their own
}

export async function isWeeklyPlanConfigured(): Promise<boolean> {
  const plan = await db.weeklyPlan.toArray();
  return plan.some((p) => p.templateId !== null);
}
