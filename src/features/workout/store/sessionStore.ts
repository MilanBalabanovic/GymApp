import { create } from 'zustand';

export interface ActiveSetRow {
  id: string;
  exerciseId: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  setType: 'normal' | 'dropset';
  dropsetIndex: number;
  parentSetId: string | null;
  confirmed: boolean;
}

export interface ActiveExercise {
  exerciseId: string;
  sets: ActiveSetRow[];
}

interface SessionState {
  sessionId: string | null;
  templateId: string | null;
  templateName: string;
  startedAt: number | null;
  exercises: ActiveExercise[];
  isActive: boolean;

  startSession: (sessionId: string, templateId: string | null, templateName: string, exercises: ActiveExercise[]) => void;
  endSession: () => void;
  confirmSet: (exerciseId: string, setId: string, weightKg: number, reps: number) => void;
  addDropSet: (exerciseId: string, afterSetId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSetValue: (exerciseId: string, setId: string, field: 'weightKg' | 'reps', value: number) => void;
}

function newSetId() {
  return `set-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: null,
  templateId: null,
  templateName: '',
  startedAt: null,
  exercises: [],
  isActive: false,

  startSession: (sessionId, templateId, templateName, exercises) => {
    set({ sessionId, templateId, templateName, startedAt: Date.now(), exercises, isActive: true });
  },

  endSession: () => {
    set({ sessionId: null, templateId: null, templateName: '', startedAt: null, exercises: [], isActive: false });
  },

  confirmSet: (exerciseId, setId, weightKg, reps) => {
    set((state) => {
      const exercises = state.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const sets = ex.sets.map((s) =>
          s.id === setId ? { ...s, confirmed: true, weightKg, reps } : s
        );
        // If this is the last set or the last unconfirmed, add a new set
        const confirmedSet = sets.find((s) => s.id === setId);
        if (!confirmedSet) return { ...ex, sets };
        // Check if there's already an unconfirmed normal set after this one
        const idx = sets.findIndex((s) => s.id === setId);
        const hasNextUnconfirmed = sets.slice(idx + 1).some((s) => !s.confirmed && s.setType === 'normal');
        if (!hasNextUnconfirmed) {
          const lastNormalSet = [...sets].reverse().find((s) => s.setType === 'normal');
          const nextSetNumber = lastNormalSet ? lastNormalSet.setNumber + 1 : 1;
          sets.push({
            id: newSetId(),
            exerciseId,
            setNumber: nextSetNumber,
            weightKg,
            reps,
            setType: 'normal',
            dropsetIndex: 0,
            parentSetId: null,
            confirmed: false,
          });
        }
        return { ...ex, sets };
      });
      return { exercises };
    });
  },

  addDropSet: (exerciseId, afterSetId) => {
    set((state) => {
      const exercises = state.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const idx = ex.sets.findIndex((s) => s.id === afterSetId);
        if (idx < 0) return ex;
        const parentSet = ex.sets[idx];
        const existingDrops = ex.sets.filter(
          (s) => s.parentSetId === afterSetId || s.parentSetId === parentSet.parentSetId
        );
        const dropsetIndex = existingDrops.length + 1;
        const newDrop: ActiveSetRow = {
          id: newSetId(),
          exerciseId,
          setNumber: parentSet.setNumber,
          weightKg: Math.max(0, parentSet.weightKg - 10),
          reps: parentSet.reps,
          setType: 'dropset',
          dropsetIndex,
          parentSetId: afterSetId,
          confirmed: false,
        };
        const sets = [...ex.sets.slice(0, idx + 1), newDrop, ...ex.sets.slice(idx + 1)];
        return { ...ex, sets };
      });
      return { exercises };
    });
  },

  removeSet: (exerciseId, setId) => {
    set((state) => {
      const exercises = state.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const sets = ex.sets.filter((s) => s.id !== setId && s.parentSetId !== setId);
        return { ...ex, sets };
      });
      return { exercises };
    });
  },

  updateSetValue: (exerciseId, setId, field, value) => {
    set((state) => {
      const exercises = state.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const sets = ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s));
        return { ...ex, sets };
      });
      return { exercises };
    });
  },
}));
