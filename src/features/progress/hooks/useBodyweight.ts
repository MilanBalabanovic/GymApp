'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import { useHaptics } from '@/core/hooks/useHaptics';

export function useBodyweight() {
  const haptics = useHaptics();

  const entries = useLiveQuery(
    () => db.bodyweightEntries.orderBy('loggedAt').toArray(),
    []
  );

  const logWeight = useCallback(async (weightKg: number) => {
    haptics.light();
    await db.bodyweightEntries.add({
      id: `bw-${Date.now()}`,
      weightKg,
      loggedAt: Date.now(),
    });
  }, [haptics]);

  const chartData = (entries ?? []).map((e) => ({
    date: e.loggedAt,
    weight: e.weightKg,
  }));

  return { entries: entries ?? [], chartData, logWeight };
}

export function useProgressPhotos() {
  const photos = useLiveQuery(
    () => db.progressPhotos.orderBy('loggedAt').toArray(),
    []
  );

  const addPhoto = useCallback(async (dataUrl: string) => {
    await db.progressPhotos.add({
      id: `photo-${Date.now()}`,
      dataUrl,
      loggedAt: Date.now(),
    });
  }, []);

  const first = photos?.[0] ?? null;
  const last = photos && photos.length > 1 ? photos[photos.length - 1] : null;

  return { photos: photos ?? [], first, last, addPhoto };
}
