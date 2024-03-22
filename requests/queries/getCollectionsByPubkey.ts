import { db } from '@/shared/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getCollectionsByPubkey(pubkey: string) {
    const q = query(collection(db, 'collections'), where('pubkey', '==', pubkey));

    const querySnapshot = await getDocs(q);
    const results: string[] = [];
    querySnapshot.forEach((doc) => {
        if (doc.id) {
            results.push(doc.id);
        }
    });

    return results;
}
