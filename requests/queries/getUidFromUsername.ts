import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/firebase/config';

const getUidFromUsername = async (username: string) => {
    const docRef = doc(db, 'usernames', username);

    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        return docSnapshot.data().uid;
    } else {
        return null;
    }
};

export { getUidFromUsername };
