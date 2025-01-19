import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Settings } from 'http2';
import { db } from '../../firebaseConfig';

export const addField = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User not found.');
  }

  await setDoc(userRef,
    {
      settings: {
        chuj: 'mi w dupe',
      },
    },
    { merge: true });
};

export const getField = async (userId: string): Promise<Settings> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User not found.');
  }

  const settings = userDoc.data().settings as Settings;

  if (settings != null) {
    return settings;
  }

  return {};
};
