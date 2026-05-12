'use client';

export const useHaptics = () => ({
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(20),
  heavy: () => navigator.vibrate?.([30, 10, 30]),
});
