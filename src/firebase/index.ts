import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Export hooks and providers
export { FirebaseProvider, FirebaseClientProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { useUser } from './auth/use-user';
export { useDoc } from './firestore/use-doc';
export { useCollection } from './firestore/use-collection';


let firebaseApp: ReturnType<typeof getApp>;

function initializeFirebase(options: FirebaseOptions = {}) {
  if (!getApps().length) {
    firebaseApp = initializeApp({ ...firebaseConfig, ...options });
  } else {
    firebaseApp = getApp();
  }

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return {
    firebaseApp,
    auth,
    firestore,
  };
}

const { firestore, auth } = initializeFirebase();

export { firestore, auth, initializeFirebase };
