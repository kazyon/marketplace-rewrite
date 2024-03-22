import { db } from '@/shared/firebase/config';
import { and, collection, getDocs, query, where } from 'firebase/firestore';
import { AhListedItem } from '@/requests/validation_schemas';

export async function getAllAhItems() {
    const filters = [];
    filters.push(where('isCanceled', '==', false));

    console.log({ filters });
    const q = query(collection(db, 'ah-listings'), and(...filters));

    const querySnapshot = await getDocs(q);
    const results: AhListedItem[] = [];
    querySnapshot.forEach((doc) => {
        if (doc.id) {
            const docData: AhListedItem = doc.data();
            results.push({ ...docData, id: doc.id });
        }
    });

    console.log(results);

    return results;
}
