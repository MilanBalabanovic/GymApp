'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WeeklyPlanSection } from '@/features/settings/components/WeeklyPlan';
import { TemplatesSection } from '@/features/settings/components/TemplateEditor';
import { ExerciseManagerSection } from '@/features/settings/components/ExerciseManager';
import { DataSection } from '@/features/settings/components/DataSection';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        background: 'var(--background)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.back()}>
          <ChevronLeft size={24} style={{ color: 'var(--primary)' }} />
        </motion.button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 flex flex-col gap-8 pt-2 pb-6">
        <WeeklyPlanSection />
        <TemplatesSection />
        <ExerciseManagerSection />
        <DataSection />
      </div>
    </div>
  );
}
