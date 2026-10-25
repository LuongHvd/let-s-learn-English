import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as required by Firebase skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline or test doc missing (expected if uninitialized).');
    }
  }
}

// Progress Schema Interface
export interface UserProgressData {
  userId: string;
  learnedWordIds: string[];
  favoriteWordIds: string[];
  completedDialogueIds: string[];
  streak: number;
  totalReviewCount: number;
  lastStudyDate: string; // YYYY-MM-DD
  dailyStats: Record<string, number>; // date string -> count
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'kiddo_english_progress_v1';

export function getLocalProgress(): UserProgressData {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    userId: 'guest',
    learnedWordIds: ['w_apple', 'w_cat', 'w_dog'],
    favoriteWordIds: ['w_apple'],
    completedDialogueIds: ['d_hello'],
    streak: 1,
    totalReviewCount: 8,
    lastStudyDate: new Date().toISOString().split('T')[0],
    dailyStats: {
      [new Date().toISOString().split('T')[0]]: 5,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function saveLocalProgress(data: UserProgressData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export async function fetchRemoteProgress(user: User): Promise<UserProgressData | null> {
  const path = `users/${user.uid}/progress/summary`;
  try {
    const snapshot = await getDoc(doc(db, 'users', user.uid, 'progress', 'summary'));
    if (snapshot.exists()) {
      return snapshot.data() as UserProgressData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveRemoteProgress(user: User, data: UserProgressData): Promise<void> {
  const userPath = `users/${user.uid}`;
  const progressPath = `users/${user.uid}/progress/summary`;
  const now = new Date().toISOString();

  // Save/update user doc first if needed
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Học viên nhí',
        photoURL: user.photoURL || '',
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
  }

  // Save progress doc
  try {
    const payload = {
      userId: user.uid,
      learnedWordIds: data.learnedWordIds.slice(0, 500),
      favoriteWordIds: data.favoriteWordIds.slice(0, 500),
      completedDialogueIds: data.completedDialogueIds.slice(0, 100),
      streak: data.streak || 1,
      totalReviewCount: data.totalReviewCount || 0,
      lastStudyDate: data.lastStudyDate || now.split('T')[0],
      dailyStats: data.dailyStats || {},
      updatedAt: now,
    };
    await setDoc(doc(db, 'users', user.uid, 'progress', 'summary'), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, progressPath);
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  await fbSignOut(auth);
}
