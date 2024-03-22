import { NextApiRequest, NextApiResponse } from 'next';
import type { DAS } from 'helius-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).send('Method not allowed.');
        return;
    }

    const {
        query: { collectionAddress },
    } = req;

    if (!collectionAddress) {
        res.status(404).send('Missing address');
        return;
    }

    const HELIUS_API_KEY = process.env.NEXT_HELIUS_API_KEY;

    const url = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

    if (!collectionAddress) {
        throw new Error('Collection address missing');
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'anft-test',
            method: 'getAssetsByGroup',
            params: {
                groupKey: 'collection',
                groupValue: collectionAddress,
                page: 1,
                limit: 1000,
                sortBy: { sortBy: 'created', sortDirection: 'desc' },
            },
        }),
    });

    const { result }: { result: DAS.GetAssetResponseList } = await response.json();

    res.json(result);
}
