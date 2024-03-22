import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/shared/firebase/config';

const getUsernameFromPubkey = async (publicKey: string) => {
    const q = query(collection(db, 'usernames'), where('pubkey', '==', publicKey));

    const querySnapshot = await getDocs(q);

    let result;
    querySnapshot.forEach((doc) => {
        if (doc.id) {
            result = doc.id;
        }
    });

    if (result) {
        return result;
    } else {
        return null;
    }
};

export { getUsernameFromPubkey };
