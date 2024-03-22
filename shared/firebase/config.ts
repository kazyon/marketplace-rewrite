import { getApp, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, Firestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { connectFunctionsEmulator, getFunctions } from '@firebase/functions';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_APP_ID,
};

const isLocalFirebase = false;
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(isLocalFirebase ? undefined : app);
if (isLocalFirebase) {
    connectAuthEmulator(auth as Auth, 'http://127.0.0.1:9099');
}

let db: Firestore;

if (isLocalFirebase) {
    db = getFirestore();
} else {
    db = getFirestore(app);
}
export { db };

export const functions = getFunctions(getApp());
functions.region = 'europe-west3';
if (isLocalFirebase) {
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

// }

export const storage = getStorage(app);
