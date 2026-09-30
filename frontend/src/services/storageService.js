import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import { MAX_FILE_SIZE, validateFile } from '../utils/constants';

export async function uploadSubmissionFile({ file, assignmentId, studentId, onProgress, maxSize = MAX_FILE_SIZE }) {
  validateFile(file, maxSize);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `assignments/${assignmentId}/${studentId}/${crypto.randomUUID()}-${safeName}`;
  const storageRef = ref(storage, storagePath);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  await new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      resolve,
    );
  });

  const fileUrl = await getDownloadURL(task.snapshot.ref);
  return { storagePath, fileUrl, fileName: file.name };
}

export async function deleteSubmissionFile(storagePath) {
  if (!storagePath) return;
  await deleteObject(ref(storage, storagePath));
}
