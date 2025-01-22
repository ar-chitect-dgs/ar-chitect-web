import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Settings } from '../../redux/slices/settings';
import { defaultKeyBinds, KeyBinds } from '../../types/KeyBinds';

export const updateKeyBinds = async (userId: string, keyBinds: KeyBinds): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User not found.');
  }

  await setDoc(userRef,
    {
      settings: {
        keyBinds,
      },
    },
    { merge: true });
};

export const getUserSettings = async (userId: string): Promise<Settings> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return { keyBinds: defaultKeyBinds };
  }

  const settings = userDoc.data().settings as Settings;

  if (settings != null) {
    return settings;
  }

  return { keyBinds: defaultKeyBinds };
};
