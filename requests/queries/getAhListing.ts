import { db } from '@/shared/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AhListedItem } from '@/requests/validation_schemas';

export async function getAhListing(address?: string) {
    const q = query(
        collection(db, 'ah-listings'),
        where('isCanceled', '==', false),
        where('mintAddress', '==', address)
    );

    const querySnapshot = await getDocs(q);
    const results: AhListedItem[] = [];
    querySnapshot.forEach((doc) => {
        if (doc.id) {
            const data = doc.data();

            const result: any = { ...data, id: doc.id };

            if ('listedAt' in result) {
                result.listedAt = result.listedAt.toDate().toUTCString();
            }

            if ('canceledAt' in result) {
                result.canceledAt = result.canceledAt.toDate().toUTCString();
            }

            if ('soldAt' in result) {
                result.soldAt = result.soldAt.toDate().toUTCString();
            }

            results.push(result);
        }
    });

    console.log({ results });

    return results;
}
