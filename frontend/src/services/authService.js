import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { ROLES } from '../utils/constants';

export async function registerStudent({ name, email, password }) {
  if (!name?.trim()) throw new Error('Name is required.');
  const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(credentials.user, { displayName: name.trim() });

  await setDoc(doc(db, 'users', credentials.user.uid), {
    userId: credentials.user.uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: ROLES.STUDENT,
    createdAt: serverTimestamp(),
  });

  return credentials.user;
}

export async function login(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credentials.user;
}

export async function logout() {
  await signOut(auth);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ user: null, profile: null });
      return;
    }
    const snapshot = await getDoc(doc(db, 'users', user.uid));
    callback({ user, profile: snapshot.exists() ? snapshot.data() : null });
  });
}
