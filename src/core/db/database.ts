import Dexie, { type Table } from 'dexie';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  isCustom: boolean;
  createdAt: number;
}

export interface Template {
  id: string;
  name: string;
  createdAt: number;
}

export interface TemplateExercise {
  id: string;
  templateId: string;
  exerciseId: string;
  orderIndex: number;
  defaultSets: number;
}

export interface WeeklyPlan {
  dayOfWeek: number; // 1=Monday, 7=Sunday
  templateId: string | null;
}

export interface Session {
  id: string;
  templateId: string | null;
  startedAt: number;
  finishedAt: number | null;
}

export interface LoggedSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  setType: 'normal' | 'dropset';
  dropsetIndex: number;
  parentSetId: string | null;
  loggedAt: number;
}

export interface BodyweightEntry {
  id: string;
  weightKg: number;
  loggedAt: number;
}

export interface ProgressPhoto {
  id: string;
  dataUrl: string;
  loggedAt: number;
}

export interface BackupData {
  version: 1;
  exportedAt: number;
  exercises: Exercise[];
  templates: Template[];
  templateExercises: TemplateExercise[];
  weeklyPlan: WeeklyPlan[];
  sessions: Session[];
  loggedSets: LoggedSet[];
  bodyweightEntries: BodyweightEntry[];
  progressPhotos: ProgressPhoto[];
}

class GymTrackerDatabase extends Dexie {
  exercises!: Table<Exercise>;
  templates!: Table<Template>;
  templateExercises!: Table<TemplateExercise>;
  weeklyPlan!: Table<WeeklyPlan>;
  sessions!: Table<Session>;
  loggedSets!: Table<LoggedSet>;
  bodyweightEntries!: Table<BodyweightEntry>;
  progressPhotos!: Table<ProgressPhoto>;

  constructor() {
    super('GymTrackerDB');
    this.version(1).stores({
      exercises: 'id, muscleGroup, isCustom',
      templates: 'id',
      templateExercises: 'id, templateId, exerciseId',
    });
    this.version(2).stores({
      exercises: 'id, name, muscleGroup, isCustom',
      templates: 'id, createdAt',
      templateExercises: 'id, templateId, exerciseId',
      weeklyPlan: 'dayOfWeek',
      sessions: 'id, startedAt',
      loggedSets: 'id, sessionId, exerciseId, loggedAt',
      bodyweightEntries: 'id, loggedAt',
      progressPhotos: 'id, loggedAt',
    });
  }
}

export const db = new GymTrackerDatabase();
