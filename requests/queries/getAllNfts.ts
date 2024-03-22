import type { DAS } from 'helius-sdk';

export type NftItemWithCollectionId = DAS.GetAssetResponse & { collectionId?: string };
export type NftWithCollectionStatus = NftItemWithCollectionId & { isCollection: boolean };
export const getAllNfts = async (address?: string | null) => {
    if (!address) {
        throw new Error('No public key');
    }
    const url = `/api/getAssetsByOwner?address=${address}`;

    const response = await fetch(url);

    const result: DAS.GetAssetResponseList = await response.json();

    if (result?.items) {
        const collections = new Set();

        const withParentCollection: NftItemWithCollectionId[] = result?.items.map((item) => {
            const clone: NftItemWithCollectionId = { ...item };
            const { grouping } = clone;
            grouping?.forEach((group) => {
                if (group && group.group_key === 'collection') {
                    collections.add(group.group_value);
                    clone.collectionId = group.group_value;
                }
            });

            return clone;
        });

        const itemsWithCollectionStatus: NftWithCollectionStatus[] = withParentCollection.map((nft) => ({
            ...nft,
            isCollection: collections.has(nft.id),
        }));

        return itemsWithCollectionStatus;
    }

    throw new Error('Fetching NFTs failed');
};
