import { usePlaybackProgress } from './usePlaybackProgress';

describe('usePlaybackProgress', () => {
  describe('progressPercent', () => {
    it('returns 0 when elapsed is 0', () => {
      expect(usePlaybackProgress(60, 0).progressPercent).toBe(0);
    });

    it('returns 100 when elapsed equals duration', () => {
      expect(usePlaybackProgress(60, 60).progressPercent).toBe(100);
    });

    it('clamps to 100 when elapsed exceeds duration', () => {
      expect(usePlaybackProgress(60, 90).progressPercent).toBe(100);
    });

    it('clamps to 0 when elapsed is negative', () => {
      expect(usePlaybackProgress(60, -5).progressPercent).toBe(0);
    });

    it('returns 0 when duration is 0 (divide-by-zero guard)', () => {
      expect(usePlaybackProgress(0, 0).progressPercent).toBe(0);
    });

    it('returns 0 when duration is negative', () => {
      expect(usePlaybackProgress(-30, 5).progressPercent).toBe(0);
    });

    it('calculates a mid-playback percentage', () => {
      expect(usePlaybackProgress(60, 30).progressPercent).toBe(50);
    });

    it('handles fractional elapsed minutes', () => {
      expect(usePlaybackProgress(60, 45).progressPercent).toBeCloseTo(75);
    });
  });

  describe('timeRemainingLabel', () => {
    it('shows hours and minutes when more than 60 min remain', () => {
      // 90 min duration, 0 elapsed → 1h 30m left
      expect(usePlaybackProgress(90, 0).timeRemainingLabel).toBe('1h 30m remaining');
    });

    it('shows hours and zero minutes on an exact hour boundary', () => {
      // 120 min duration, 60 elapsed → exactly 1h 0m left
      expect(usePlaybackProgress(120, 60).timeRemainingLabel).toBe('1h 0m remaining');
    });

    it('shows only minutes when less than 60 min remain', () => {
      // 60 min duration, 20 elapsed → 40m left
      expect(usePlaybackProgress(60, 20).timeRemainingLabel).toBe('40m remaining');
    });

    it('shows 0m remaining when playback is complete', () => {
      expect(usePlaybackProgress(60, 60).timeRemainingLabel).toBe('0m remaining');
    });

    it('shows 0m remaining when elapsed exceeds duration', () => {
      expect(usePlaybackProgress(60, 90).timeRemainingLabel).toBe('0m remaining');
    });

    it('ceils fractional remaining minutes', () => {
      // 60 min duration, 19.5 elapsed → 40.5 min left → ceil → 41m
      expect(usePlaybackProgress(60, 19.5).timeRemainingLabel).toBe('41m remaining');
    });
  });
});
