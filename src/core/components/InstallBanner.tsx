'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function InstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).standalone === true;
    const dismissed = localStorage.getItem('gymtracker-install-dismissed');

    if (isIOS && !isStandalone && !dismissed) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('gymtracker-install-dismissed', '1');
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop tap to dismiss */}
          <div className="fixed inset-0 z-40" onClick={dismiss} />

          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed left-4 right-4 z-50 rounded-2xl p-4"
            style={{
              bottom: 'calc(72px + env(safe-area-inset-bottom) + 8px)',
              background: 'var(--card)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src="/apple-touch-icon.png"
                  alt="GymTracker"
                  className="w-11 h-11 rounded-xl flex-shrink-0"
                />
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                    Install GymTracker
                  </p>
                  <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                    Add to your Home Screen
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={dismiss}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--surface)' }}
              >
                <X size={14} style={{ color: 'var(--secondary)' }} />
              </motion.button>
            </div>

            {/* Instructions */}
            <div
              className="rounded-xl px-3 py-2.5 flex items-center gap-2 flex-wrap"
              style={{ background: 'var(--surface)' }}
            >
              <span className="text-xs" style={{ color: 'var(--secondary)' }}>Tap</span>
              {/* Share icon — matches exactly what Safari shows */}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold"
                style={{ background: 'var(--border)', color: 'var(--primary)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Share
              </span>
              <span className="text-xs" style={{ color: 'var(--secondary)' }}>then</span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold"
                style={{ background: 'var(--border)', color: 'var(--primary)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Add to Home Screen
              </span>
            </div>

            {/* Arrow pointing down toward the toolbar */}
            <div className="flex justify-center mt-2">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M8 10 L0 0 L16 0 Z" fill="rgba(255,255,255,0.15)"/>
              </svg>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
