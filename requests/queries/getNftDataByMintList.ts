import type { DAS } from 'helius-sdk';

export async function getNftDataByMintList(mintList?: string[]) {
    if (!mintList) {
        throw new Error();
    }

    const url = `/api/getAssetBatch`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mintList }),
    });
    const { result }: { result: DAS.GetAssetResponse[] } = await response.json();

    return result;
}
