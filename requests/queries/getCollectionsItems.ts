import type { DAS } from 'helius-sdk';

export const getCollectionsItems = async (collectionAddress?: string | null) => {
    if (!collectionAddress) {
        throw new Error('Collection address missing');
    }

    const url = `/api/getAssetsByGroup?collectionAddress=${collectionAddress}`;

    const response = await fetch(url);

    const result: DAS.GetAssetResponseList = await response.json();

    return result;
};
