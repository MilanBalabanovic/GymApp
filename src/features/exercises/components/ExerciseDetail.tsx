'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import { useExerciseHistory } from '@/features/exercises/hooks/useExercises';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface ExerciseDetailProps {
  exerciseId: string;
}

export function ExerciseDetail({ exerciseId }: ExerciseDetailProps) {
  const router = useRouter();
  const exercise = useLiveQuery(() => db.exercises.get(exerciseId), [exerciseId]);
  const data = useExerciseHistory(exerciseId);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setChartReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!exercise) return null;

  const chartData = data?.chartData ?? [];
  const history = data?.history ?? [];

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
        <h1 className="font-bold text-xl" style={{ color: 'var(--primary)' }}>
          {exercise.name}
        </h1>
      </div>

      <div className="px-4">
        {/* Chart */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>
            Max Weight (last 30 sessions)
          </p>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => format(new Date(v), 'MMM d')}
                  tick={{ fill: 'var(--secondary)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--secondary)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--primary)',
                    fontSize: 12,
                  }}
                  labelFormatter={(v) => format(new Date(v), 'MMM d, yyyy')}
                  formatter={(v) => [`${v} kg`, 'Max Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)', r: 3 }}
                  activeDot={{ r: 5, fill: 'var(--accent-green)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--secondary)' }}>
                Need at least 2 sessions to show chart
              </p>
            </div>
          )}
        </div>

        {/* History */}
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>
          Session History
        </p>
        {history.length === 0 ? (
          <p className="text-sm py-6 text-center" style={{ color: 'var(--secondary)' }}>
            No history yet
          </p>
        ) : (
          <div className="flex flex-col gap-4 pb-6">
            {history.map((session) => (
              <div key={session.sessionId}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>
                  {format(new Date(session.date), 'EEEE, MMM d yyyy')}
                </p>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  {session.sets.map((s, idx) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between px-4 py-3"
                      style={{ borderTop: idx > 0 ? '1px solid var(--border)' : 'none' }}
                    >
                      <div className={s.setType === 'dropset' ? 'pl-4' : ''}>
                        {s.setType === 'dropset' ? (
                          <p className="text-xs" style={{ color: 'var(--accent-green)' }}>
                            ↳ Drop {s.dropsetIndex}
                          </p>
                        ) : (
                          <p className="text-sm font-semibold" style={{ color: 'var(--secondary)' }}>
                            Set {s.setNumber}
                          </p>
                        )}
                      </div>
                      <p className="text-base font-semibold tabular-nums" style={{ color: 'var(--primary)' }}>
                        {s.weightKg} kg × {s.reps}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
