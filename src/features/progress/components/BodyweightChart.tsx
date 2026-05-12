'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface ChartEntry {
  date: number;
  weight: number;
}

interface BodyweightChartProps {
  data: ChartEntry[];
}

export function BodyweightChart({ data }: BodyweightChartProps) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>
        Bodyweight
      </p>
      {data.length > 1 ? (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
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
              domain={['auto', 'auto']}
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
              formatter={(v) => [`${v} kg`, 'Weight']}
            />
            <Line
              type="monotone"
              dataKey="weight"
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
            {data.length === 0 ? 'No weight entries yet' : 'Add another entry to see chart'}
          </p>
        </div>
      )}
    </div>
  );
}
