'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isWeeklyPlanConfigured } from '@/core/db/seed';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check on first load at /workout
    if (pathname !== '/workout') return;
    isWeeklyPlanConfigured().then((configured) => {
      if (!configured) {
        // We don't hard redirect — just show banner
        // The WorkoutHome will handle the "no template" state
      }
    });
  }, [pathname, router]);

  return <>{children}</>;
}
