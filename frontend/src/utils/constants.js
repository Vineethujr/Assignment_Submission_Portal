export const ROLES = Object.freeze({
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
});

export const SUBMISSION_STATUS = Object.freeze({
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  SUBMITTED: 'SUBMITTED',
  LATE: 'LATE',
  GRADED: 'GRADED',
});

export const ALLOWED_FILE_TYPES = Object.freeze([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
]);

export const ALLOWED_EXTENSIONS = Object.freeze(['.pdf', '.docx', '.png', '.jpg', '.jpeg']);
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = toDate(value);
  return date ? date.toLocaleString() : '—';
}

export function isLate(submittedAt, deadline) {
  const submitted = toDate(submittedAt);
  const due = toDate(deadline);
  return Boolean(submitted && due && submitted.getTime() > due.getTime());
}

export function validateFile(file, maxSize = MAX_FILE_SIZE) {
  if (!file) throw new Error('Please select a file.');
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
  }
  if (file.size > maxSize) {
    throw new Error(`File is too large. Maximum allowed size is ${Math.round(maxSize / 1024 / 1024)} MB.`);
  }
  return true;
}
