'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60"
            style={{ zIndex: 200 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden"
            style={{ background: 'var(--surface)', zIndex: 201 }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) onClose();
            }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />
            </div>
            {title && (
              <div className="px-5 pb-3 pt-1">
                <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--secondary)' }}>
                  {title}
                </p>
              </div>
            )}
            <div style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
