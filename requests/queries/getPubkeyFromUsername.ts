import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/firebase/config';

const getPubkeyFromUsername = async (username: string) => {
    const docRef = doc(db, 'usernames', username);

    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        return docSnapshot.data().pubkey;
    } else {
        return null;
    }
};

export { getPubkeyFromUsername };
