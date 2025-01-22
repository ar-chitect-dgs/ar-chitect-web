import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const publicKey = 'AIzaSyCvc1jR9urJopY7PrOD08pMqCp9GP_M6zM';

const firebaseConfig = {
  apiKey: process.env.USE_PRIVATE_KEY ? process.env.REACT_APP_FIREBASE_API_KEY : publicKey,
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
export const db = getFirestore(app);
