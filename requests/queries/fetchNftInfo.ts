import type { DAS } from 'helius-sdk';

export const fetchNftInfo = async (address?: string | null) => {
    // TODO: this needs to moved into a proxy endpoint

    if (!address) {
        throw new Error('Failed to fetch NFT info');
    }
    const url = `/api/getAsset?address=${address}`;

    const response = await fetch(url);

    const result: DAS.GetAssetResponse = await response.json();

    console.log({ result });
    return result;
};
