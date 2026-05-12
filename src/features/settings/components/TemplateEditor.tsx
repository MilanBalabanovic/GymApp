'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronRight, Minus } from 'lucide-react';
import { BottomSheet } from '@/core/components/BottomSheet';
import { useTemplates } from '@/features/settings/hooks/useSettings';
import { useHaptics } from '@/core/hooks/useHaptics';

export function TemplatesSection() {
  const {
    templates,
    exercises,
    getTemplateExercises,
    createTemplate,
    renameTemplate,
    deleteTemplate,
    addExerciseToTemplate,
    removeExerciseFromTemplate,
    updateDefaultSets,
  } = useTemplates();
  const haptics = useHaptics();

  const [editId, setEditId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [addExOpen, setAddExOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const editTemplate = templates.find((t) => t.id === editId);
  const editExercises = editId ? getTemplateExercises(editId) : [];

  const handleCreate = async () => {
    if (!createName.trim()) return;
    haptics.medium();
    await createTemplate(createName.trim());
    setCreateName('');
    setCreateOpen(false);
  };

  const handleRename = async () => {
    if (!editId || !newName.trim()) return;
    await renameTemplate(editId, newName.trim());
    setNewName('');
  };

  const handleDelete = async (id: string) => {
    haptics.medium();
    await deleteTemplate(id);
    setConfirmDeleteId(null);
    if (editId === id) setEditId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-1 mb-3">
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
          Templates
        </p>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { haptics.light(); setCreateOpen(true); }}
        >
          <Plus size={20} style={{ color: 'var(--primary)' }} />
        </motion.button>
      </div>

      {templates.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--secondary)' }}>
          No templates yet — create one
        </p>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {templates.map((t, i) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => { haptics.light(); setEditId(t.id); setNewName(t.name); }}
              className="flex items-center justify-between w-full px-5 py-4"
              style={{
                background: 'var(--card)',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
              }}
            >
              <p className="font-medium text-sm" style={{ color: 'var(--primary)' }}>{t.name}</p>
              <div className="flex items-center gap-3">
                <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                  {getTemplateExercises(t.id).length} exercises
                </p>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => { e.stopPropagation(); haptics.medium(); setConfirmDeleteId(t.id); }}
                >
                  <Trash2 size={16} style={{ color: 'var(--destructive)' }} />
                </motion.button>
                <ChevronRight size={16} style={{ color: 'var(--secondary)' }} />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Edit template sheet */}
      <BottomSheet open={editId !== null} onClose={() => setEditId(null)} title="Edit Template">
        <div className="px-4 pb-4 flex flex-col gap-4">
          {/* Rename */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Template name"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--primary)',
              }}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRename}
              className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--primary)', color: '#000' }}
            >
              Save
            </motion.button>
          </div>

          {/* Exercise list */}
          <div className="flex flex-col gap-2">
            {editExercises.map((te) => {
              const ex = exercises.find((e) => e.id === te.exerciseId);
              return (
                <div
                  key={te.id}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                    {ex?.name ?? 'Unknown'}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateDefaultSets(te.id, Math.max(1, te.defaultSets - 1))}
                      >
                        <Minus size={14} style={{ color: 'var(--secondary)' }} />
                      </motion.button>
                      <p className="text-sm font-semibold tabular-nums w-4 text-center" style={{ color: 'var(--primary)' }}>
                        {te.defaultSets}
                      </p>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateDefaultSets(te.id, te.defaultSets + 1)}
                      >
                        <Plus size={14} style={{ color: 'var(--secondary)' }} />
                      </motion.button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeExerciseFromTemplate(te.id)}
                    >
                      <Trash2 size={14} style={{ color: 'var(--destructive)' }} />
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setAddExOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: 'var(--card)', border: '1px dashed var(--border)', color: 'var(--secondary)' }}
          >
            <Plus size={16} />
            Add Exercise
          </motion.button>
        </div>
      </BottomSheet>

      {/* Add exercise sheet */}
      <BottomSheet open={addExOpen} onClose={() => setAddExOpen(false)} title="Add Exercise">
        <div className="px-4 pb-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto no-scrollbar">
          {exercises
            .filter((ex) => !editExercises.some((te) => te.exerciseId === ex.id))
            .map((ex) => (
              <motion.button
                key={ex.id}
                whileTap={{ scale: 0.97 }}
                onClick={async () => {
                  if (editId) {
                    await addExerciseToTemplate(editId, ex.id);
                    setAddExOpen(false);
                  }
                }}
                className="flex items-center justify-between w-full rounded-xl px-5 py-3.5 text-left"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <p className="font-medium text-sm" style={{ color: 'var(--primary)' }}>{ex.name}</p>
                <p className="text-xs capitalize" style={{ color: 'var(--secondary)' }}>{ex.muscleGroup}</p>
              </motion.button>
            ))}
        </div>
      </BottomSheet>

      {/* Create template sheet */}
      <BottomSheet open={createOpen} onClose={() => setCreateOpen(false)} title="New Template">
        <div className="px-4 pb-4 flex flex-col gap-3">
          <input
            type="text"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Template name (e.g. Push Day)"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--primary)',
            }}
            autoFocus
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ background: 'var(--primary)', color: '#000' }}
          >
            Create Template
          </motion.button>
        </div>
      </BottomSheet>

      {/* Confirm delete */}
      <BottomSheet open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Delete Template">
        <div className="px-4 pb-4 flex flex-col gap-3">
          <p className="text-sm text-center" style={{ color: 'var(--secondary)' }}>
            This will remove the template and unassign it from the weekly plan.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ background: 'var(--destructive)', color: '#fff' }}
          >
            Delete Template
          </motion.button>
        </div>
      </BottomSheet>
    </div>
  );
}
