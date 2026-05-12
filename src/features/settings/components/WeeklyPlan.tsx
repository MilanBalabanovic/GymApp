'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { BottomSheet } from '@/core/components/BottomSheet';
import { useWeeklyPlan } from '@/features/settings/hooks/useSettings';
import { useHaptics } from '@/core/hooks/useHaptics';

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklyPlanSection() {
  const { planMap, templates, setDayTemplate, templateMap } = useWeeklyPlan();
  const haptics = useHaptics();
  const [editDay, setEditDay] = useState<number | null>(null);

  const handleSelect = async (templateId: string | null) => {
    if (editDay === null) return;
    haptics.light();
    await setDayTemplate(editDay, templateId);
    setEditDay(null);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest px-1 mb-3" style={{ color: 'var(--secondary)' }}>
        Weekly Plan
      </p>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--border)' }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((day, i) => {
          const templateId = planMap.get(day) ?? null;
          const template = templateId ? templateMap.get(templateId) : null;
          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.98 }}
              onClick={() => { haptics.light(); setEditDay(day); }}
              className="flex items-center justify-between w-full px-5 py-4"
              style={{
                background: 'var(--card)',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
              }}
            >
              <p className="font-medium text-sm" style={{ color: 'var(--primary)' }}>
                {DAY_NAMES[day]}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm" style={{ color: template ? 'var(--primary)' : 'var(--secondary)' }}>
                  {template ? template.name : 'Rest'}
                </p>
                <ChevronRight size={16} style={{ color: 'var(--secondary)' }} />
              </div>
            </motion.button>
          );
        })}
      </div>

      <BottomSheet
        open={editDay !== null}
        onClose={() => setEditDay(null)}
        title={editDay ? `${DAY_NAMES[editDay]} Workout` : ''}
      >
        <div className="px-4 pb-4 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(null)}
            className="flex items-center w-full rounded-2xl px-5 py-4 text-left"
            style={{
              background: 'var(--card)',
              border: `1px solid ${planMap.get(editDay ?? 0) === null ? 'var(--accent-green)' : 'var(--border)'}`,
            }}
          >
            <p className="font-semibold" style={{ color: 'var(--secondary)' }}>Rest Day</p>
          </motion.button>
          {templates.map((t) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(t.id)}
              className="flex items-center w-full rounded-2xl px-5 py-4 text-left"
              style={{
                background: 'var(--card)',
                border: `1px solid ${planMap.get(editDay ?? 0) === t.id ? 'var(--accent-green)' : 'var(--border)'}`,
              }}
            >
              <p className="font-semibold" style={{ color: 'var(--primary)' }}>{t.name}</p>
            </motion.button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
