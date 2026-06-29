interface PlaybackProgress {
  /** Playback completion, 0–100 inclusive. Always a finite number. */
  progressPercent: number;
  /** Human-readable time remaining, e.g. "1h 23m remaining" or "45m remaining". */
  timeRemainingLabel: string;
}

/**
 * Derives playback progress and a time-remaining label from duration and elapsed time.
 *
 * @param durationMinutes - Total content length in minutes. Values ≤ 0 are treated as
 *   "unknown duration" and yield 0 % progress.
 * @param elapsedMinutes - Minutes of content already played. May be fractional.
 *   Negative values are clamped to 0; values beyond `durationMinutes` clamp to 100 %.
 * @returns `progressPercent` and `timeRemainingLabel`.
 *
 * @example
 * const { progressPercent, timeRemainingLabel } = usePlaybackProgress(90, 30);
 * // progressPercent  → 33.33...
 * // timeRemainingLabel → "1h 0m remaining"
 */
export function usePlaybackProgress(
  durationMinutes: number,
  elapsedMinutes: number,
): PlaybackProgress {
  // Guard: durationMinutes ≤ 0 would produce Infinity or NaN, so short-circuit.
  const progressPercent =
    durationMinutes <= 0
      ? 0
      : Math.min(100, Math.max(0, (elapsedMinutes / durationMinutes) * 100));

  const remainingMinutes = Math.ceil(Math.max(0, durationMinutes - elapsedMinutes));
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  const timeRemainingLabel =
    hours > 0 ? `${hours}h ${minutes}m remaining` : `${minutes}m remaining`;

  return { progressPercent, timeRemainingLabel };
}
