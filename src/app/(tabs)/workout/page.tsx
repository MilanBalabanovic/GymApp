'use client';

import { useSessionStore } from '@/features/workout/store/sessionStore';
import { WorkoutHome } from '@/features/workout/components/WorkoutHome';
import { ActiveSession } from '@/features/workout/components/ActiveSession';

export default function WorkoutPage() {
  const isActive = useSessionStore((s) => s.isActive);
  return isActive ? <ActiveSession /> : <WorkoutHome />;
}
