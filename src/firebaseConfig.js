import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'ar-chitect-a0b25.firebaseapp.com',
  projectId: 'ar-chitect-a0b25',
  storageBucket: 'ar-chitect-a0b25.appspot.com',
  messagingSenderId: '558103318787',
  appId: '1:558103318787:web:c0eab668e0ca87f56a5936',
  measurementId: 'G-9F0J5M30R4',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
