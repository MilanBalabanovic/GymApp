'use client';

import { motion } from 'framer-motion';
import { Dumbbell, BarChart2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHaptics } from '@/core/hooks/useHaptics';

const TABS = [
  { href: '/exercises', label: 'Exercises', Icon: Dumbbell },
  { href: '/workout', label: 'Workout', Icon: BarChart2, large: true },
  { href: '/progress', label: 'Progress', Icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();
  const haptics = useHaptics();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-end justify-around"
      style={{
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ href, label, Icon, large }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            onClick={() => haptics.light()}
            className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] py-2"
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <Icon
                size={large ? 28 : 22}
                style={{ color: active ? 'var(--primary)' : 'var(--secondary)' }}
                strokeWidth={active ? 2.5 : 1.8}
              />
            </motion.div>
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? 'var(--primary)' : 'var(--secondary)' }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
