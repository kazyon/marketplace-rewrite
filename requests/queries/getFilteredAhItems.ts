import { db } from '@/shared/firebase/config';
import { and, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { AhListedItem } from '@/requests/validation_schemas';
import { OrderableKeys, SortableTypes } from '@/sections/marketplace/types';

export type AhFilters = {
    categories: string[];
    fileTypes: string[];
    orderByKey: OrderableKeys;
    sortDirection: SortableTypes;
};
export async function getFilteredAhItems({
    categories,
    fileTypes,
    orderByKey = OrderableKeys.listedAt,
    sortDirection = SortableTypes.desc,
}: AhFilters) {
    console.log('FILTERS', { categories, fileTypes, orderByKey, sortDirection });
    const filters = [];
    filters.push(where('isCanceled', '==', false));

    filters.push(where('hasSold', '==', false));

    if (categories && categories.length > 0) {
        filters.push(where('category', 'in', categories));
    }

    if (fileTypes && fileTypes.length > 0) {
        filters.push(where('types', 'array-contains-any', fileTypes));
    }

    const restQueryParams = [];

    if (orderByKey) {
        restQueryParams.push(orderBy(orderByKey, sortDirection));
    }

    const q = query(collection(db, 'ah-listings'), and(...filters), ...restQueryParams);

    type ResultWithId = AhListedItem & { id: string };
    const querySnapshot = await getDocs(q);
    const results: ResultWithId[] = [];
    querySnapshot.forEach((doc) => {
        if (doc.id) {
            const data = doc.data() as AhListedItem;
            results.push({ ...data, id: doc.id });
        }
    });

    return results;
}
