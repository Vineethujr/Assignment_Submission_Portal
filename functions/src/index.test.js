import { describe, expect, test } from 'vitest';

function isLate(submittedAt, dueAt) {
  return new Date(submittedAt).getTime() > new Date(dueAt).getTime();
}

describe('deadline logic', () => {
  test('marks a submission late when submitted after deadline', () => {
    expect(isLate('2026-09-01T10:00:00Z', '2026-09-01T09:00:00Z')).toBe(true);
  });
  test('marks a submission on time when submitted before deadline', () => {
    expect(isLate('2026-09-01T08:00:00Z', '2026-09-01T09:00:00Z')).toBe(false);
  });
});
