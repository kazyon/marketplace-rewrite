import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/firebase/config';

export const getUsernameAvailability = async (username: string) => {
    if (username) {
        const docRef = doc(db, 'usernames', username);

        const docSnapshot = await getDoc(docRef);

        return !docSnapshot.exists();
    }
};
