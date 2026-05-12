'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { BottomSheet } from '@/core/components/BottomSheet';
import { useExerciseManager } from '@/features/settings/hooks/useSettings';
import { useHaptics } from '@/core/hooks/useHaptics';
import type { Exercise } from '@/core/db/database';

const MUSCLE_GROUPS: Exercise['muscleGroup'][] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

export function ExerciseManagerSection() {
  const { grouped, addExercise, updateExercise, deleteExercise } = useExerciseManager();
  const haptics = useHaptics();
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMuscle, setNewMuscle] = useState<Exercise['muscleGroup']>('chest');
  const [editEx, setEditEx] = useState<Exercise | null>(null);
  const [editName, setEditName] = useState('');
  const [editMuscle, setEditMuscle] = useState<Exercise['muscleGroup']>('chest');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    haptics.medium();
    await addExercise(newName.trim(), newMuscle);
    setNewName('');
    setAddOpen(false);
  };

  const handleUpdate = async () => {
    if (!editEx) return;
    await updateExercise(editEx.id, { name: editName, muscleGroup: editMuscle });
    setEditEx(null);
  };

  const handleDelete = async (id: string) => {
    haptics.medium();
    await deleteExercise(id);
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-1 mb-3">
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
          Exercises
        </p>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { haptics.light(); setAddOpen(true); }}>
          <Plus size={20} style={{ color: 'var(--primary)' }} />
        </motion.button>
      </div>

      <div className="flex flex-col gap-3">
        {MUSCLE_GROUPS.map((group) => {
          const exes = grouped[group] ?? [];
          if (exes.length === 0) return null;
          return (
            <div key={group}>
              <p className="text-xs uppercase tracking-widest px-1 mb-2" style={{ color: 'var(--secondary)' }}>
                {group}
              </p>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {exes.map((ex, i) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between px-5 py-3.5"
                    style={{
                      background: 'var(--card)',
                      borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={!ex.isCustom}
                      onClick={() => {
                        if (!ex.isCustom) return;
                        haptics.light();
                        setEditEx(ex);
                        setEditName(ex.name);
                        setEditMuscle(ex.muscleGroup);
                      }}
                      className="flex-1 text-left"
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{ex.name}</p>
                      {ex.isCustom && (
                        <p className="text-xs" style={{ color: 'var(--secondary)' }}>Custom</p>
                      )}
                    </motion.button>
                    {ex.isCustom && (
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => { haptics.medium(); setConfirmDeleteId(ex.id); }}
                      >
                        <Trash2 size={16} style={{ color: 'var(--destructive)' }} />
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add exercise */}
      <BottomSheet open={addOpen} onClose={() => setAddOpen(false)} title="New Exercise">
        <div className="px-4 pb-4 flex flex-col gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Exercise name"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--primary)' }}
            autoFocus
          />
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.map((mg) => (
              <motion.button
                key={mg}
                whileTap={{ scale: 0.93 }}
                onClick={() => setNewMuscle(mg)}
                className="px-3 py-1.5 rounded-full text-xs font-medium capitalize"
                style={{
                  background: newMuscle === mg ? 'var(--primary)' : 'var(--card)',
                  color: newMuscle === mg ? '#000' : 'var(--secondary)',
                  border: `1px solid ${newMuscle === mg ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                {mg}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ background: 'var(--primary)', color: '#000' }}
          >
            Add Exercise
          </motion.button>
        </div>
      </BottomSheet>

      {/* Edit exercise */}
      <BottomSheet open={editEx !== null} onClose={() => setEditEx(null)} title="Edit Exercise">
        <div className="px-4 pb-4 flex flex-col gap-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--primary)' }}
          />
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.map((mg) => (
              <motion.button
                key={mg}
                whileTap={{ scale: 0.93 }}
                onClick={() => setEditMuscle(mg)}
                className="px-3 py-1.5 rounded-full text-xs font-medium capitalize"
                style={{
                  background: editMuscle === mg ? 'var(--primary)' : 'var(--card)',
                  color: editMuscle === mg ? '#000' : 'var(--secondary)',
                  border: `1px solid ${editMuscle === mg ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                {mg}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleUpdate}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ background: 'var(--primary)', color: '#000' }}
          >
            Save Changes
          </motion.button>
        </div>
      </BottomSheet>

      {/* Confirm delete */}
      <BottomSheet open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Delete Exercise">
        <div className="px-4 pb-4 flex flex-col gap-3">
          <p className="text-sm text-center" style={{ color: 'var(--secondary)' }}>
            This will remove the exercise from all templates.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ background: 'var(--destructive)', color: '#fff' }}
          >
            Delete Exercise
          </motion.button>
        </div>
      </BottomSheet>
    </div>
  );
}
