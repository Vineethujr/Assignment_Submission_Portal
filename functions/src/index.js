const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const logger = require('firebase-functions/logger');

initializeApp();
const db = getFirestore();

/**
 * Server-side deadline classification + version numbering.
 * The frontend creates the submission; this trigger becomes the trusted
 * asynchronous processing step. Cloud Functions executes with Admin SDK
 * access and therefore bypasses client Security Rules.
 */
exports.onSubmissionCreate = onDocumentCreated(
  { document: 'submissions/{submissionId}', region: 'asia-south1' },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const submission = snapshot.data();
    const assignmentSnap = await db.collection('assignments').doc(submission.assignmentId).get();
    if (!assignmentSnap.exists) {
      logger.warn('Assignment missing for submission', { submissionId: snapshot.id });
      return;
    }

    const assignment = assignmentSnap.data();
    const dueAt = toDate(assignment.deadline);
    const submittedAt = toDate(submission.submittedAt) || new Date();
    const late = dueAt ? submittedAt.getTime() > dueAt.getTime() : false;

    const priorSnap = await db.collection('submissions')
      .where('assignmentId', '==', submission.assignmentId)
      .where('studentId', '==', submission.studentId)
      .get();
    const version = priorSnap.size;

    await snapshot.ref.update({
      version,
      submissionStatus: late ? 'LATE' : 'SUBMITTED',
      deadlineProcessedAt: Timestamp.now(),
    });
  },
);

function toDate(value) {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value.toDate) return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

exports.dailyAnalytics = onSchedule(
  { schedule: 'every 24 hours', timeZone: 'Asia/Kolkata', region: 'asia-south1' },
  async () => {
    const snapshot = await db.collection('submissions').get();
    const aggregate = {};
    snapshot.forEach((doc) => {
      const row = doc.data();
      const key = `${row.courseId || 'unknown'}_${row.assignmentId}`;
      aggregate[key] ??= { total: 0, late: 0, graded: 0 };
      aggregate[key].total += 1;
      if (row.submissionStatus === 'LATE') aggregate[key].late += 1;
      if (row.submissionStatus === 'GRADED') aggregate[key].graded += 1;
    });

    const batch = db.batch();
    Object.entries(aggregate).forEach(([key, value]) => {
      const ref = db.collection('analytics').doc(key);
      batch.set(ref, {
        ...value,
        onTimePct: value.total ? ((value.total - value.late) / value.total) * 100 : 0,
        updatedAt: Timestamp.now(),
      }, { merge: true });
    });
    await batch.commit();
  },
);
