import { describe, expect, test } from 'vitest';
import { isLate, validateFile, MAX_FILE_SIZE } from './constants';

describe('assignment validation helpers', () => {
  test('deadline is late only after due time', () => {
    expect(isLate('2026-09-01T10:00:00Z', '2026-09-01T09:00:00Z')).toBe(true);
    expect(isLate('2026-09-01T08:00:00Z', '2026-09-01T09:00:00Z')).toBe(false);
  });

  test('rejects unsupported file types', () => {
    const file = new File(['hello'], 'test.exe', { type: 'application/octet-stream' });
    expect(() => validateFile(file)).toThrow('Invalid file type');
  });

  test('rejects files above 20 MB default', () => {
    const file = new File([new Uint8Array(MAX_FILE_SIZE + 1)], 'big.pdf', { type: 'application/pdf' });
    expect(() => validateFile(file)).toThrow('too large');
  });
});
