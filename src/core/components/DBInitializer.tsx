'use client';

import { useEffect } from 'react';
import { seedDatabase } from '@/core/db/seed';

export function DBInitializer() {
  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  return null;
}
