'use client';

import { use } from 'react';
import { ExerciseDetail } from '@/features/exercises/components/ExerciseDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ExerciseDetailPage({ params }: Props) {
  const { id } = use(params);
  return <ExerciseDetail exerciseId={id} />;
}
