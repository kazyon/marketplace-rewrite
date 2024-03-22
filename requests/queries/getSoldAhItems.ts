import { db } from '@/shared/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AhListedItem } from '@/requests/validation_schemas';

export async function getSoldAhItems(address?: string) {
    const q = query(
        collection(db, 'ah-listings'),
        where('seller', '==', address),
        where('isCanceled', '==', false),
        where('hasSold', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const results: AhListedItem[] = [];
    querySnapshot.forEach((doc) => {
        if (doc.id) {
            results.push(doc.data() as AhListedItem);
        }
    });

    return results;
}
