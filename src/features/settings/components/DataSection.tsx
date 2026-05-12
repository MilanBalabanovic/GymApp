'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload } from 'lucide-react';
import { BottomSheet } from '@/core/components/BottomSheet';
import { db } from '@/core/db/database';
import type { BackupData } from '@/core/db/database';
import { useHaptics } from '@/core/hooks/useHaptics';
import { format } from 'date-fns';

export function DataSection() {
  const haptics = useHaptics();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<BackupData | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = async () => {
    haptics.medium();
    const backup: BackupData = {
      version: 1,
      exportedAt: Date.now(),
      exercises: await db.exercises.toArray(),
      templates: await db.templates.toArray(),
      templateExercises: await db.templateExercises.toArray(),
      weeklyPlan: await db.weeklyPlan.toArray(),
      sessions: await db.sessions.toArray(),
      loggedSets: await db.loggedSets.toArray(),
      bodyweightEntries: await db.bodyweightEntries.toArray(),
      progressPhotos: await db.progressPhotos.toArray(),
    };

    const json = JSON.stringify(backup);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymtracker-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup exported successfully');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as BackupData;
        if (data.version !== 1 || !data.exercises || !data.sessions) {
          showToast('Invalid backup file', 'err');
          return;
        }
        setPendingBackup(data);
        setImportConfirmOpen(true);
      } catch {
        showToast('Failed to parse backup file', 'err');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImportConfirm = async () => {
    if (!pendingBackup) return;
    haptics.medium();
    try {
      const tables = [
        db.exercises,
        db.templates,
        db.templateExercises,
        db.weeklyPlan,
        db.sessions,
        db.loggedSets,
        db.bodyweightEntries,
        db.progressPhotos,
      ];
      await db.transaction('rw', tables, async () => {
          await db.exercises.clear();
          await db.templates.clear();
          await db.templateExercises.clear();
          await db.weeklyPlan.clear();
          await db.sessions.clear();
          await db.loggedSets.clear();
          await db.bodyweightEntries.clear();
          await db.progressPhotos.clear();

          if (pendingBackup.exercises.length) await db.exercises.bulkAdd(pendingBackup.exercises);
          if (pendingBackup.templates.length) await db.templates.bulkAdd(pendingBackup.templates);
          if (pendingBackup.templateExercises.length) await db.templateExercises.bulkAdd(pendingBackup.templateExercises);
          if (pendingBackup.weeklyPlan.length) await db.weeklyPlan.bulkAdd(pendingBackup.weeklyPlan);
          if (pendingBackup.sessions.length) await db.sessions.bulkAdd(pendingBackup.sessions);
          if (pendingBackup.loggedSets.length) await db.loggedSets.bulkAdd(pendingBackup.loggedSets);
          if (pendingBackup.bodyweightEntries.length) await db.bodyweightEntries.bulkAdd(pendingBackup.bodyweightEntries);
          if (pendingBackup.progressPhotos.length) await db.progressPhotos.bulkAdd(pendingBackup.progressPhotos);
        }
      );
      setImportConfirmOpen(false);
      setPendingBackup(null);
      showToast('Data imported successfully');
    } catch {
      showToast('Import failed', 'err');
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest px-1 mb-3" style={{ color: 'var(--secondary)' }}>
        Data
      </p>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="flex items-center gap-4 w-full px-5 py-4 text-left"
          style={{ background: 'var(--card)' }}
        >
          <Download size={18} style={{ color: 'var(--primary)' }} />
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--primary)' }}>Export Data</p>
            <p className="text-xs" style={{ color: 'var(--secondary)' }}>Download JSON backup</p>
          </div>
        </motion.button>
        <label>
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 w-full px-5 py-4 text-left cursor-pointer"
            style={{
              background: 'var(--card)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <Upload size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--primary)' }}>Import Data</p>
              <p className="text-xs" style={{ color: 'var(--secondary)' }}>Restore from JSON backup</p>
            </div>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportFile}
          />
        </label>
      </div>

      {/* Import confirm */}
      <BottomSheet open={importConfirmOpen} onClose={() => setImportConfirmOpen(false)} title="Import Data">
        <div className="px-4 pb-4 flex flex-col gap-3">
          <p className="text-sm text-center" style={{ color: 'var(--secondary)' }}>
            This will replace <strong style={{ color: 'var(--primary)' }}>all your current data</strong> with the backup. This cannot be undone.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleImportConfirm}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ background: 'var(--destructive)', color: '#fff' }}
          >
            Replace All Data
          </motion.button>
        </div>
      </BottomSheet>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg z-50"
          style={{
            background: toast.type === 'ok' ? 'var(--accent-green)' : 'var(--destructive)',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}
        >
          {toast.msg}
        </motion.div>
      )}
    </div>
  );
}
