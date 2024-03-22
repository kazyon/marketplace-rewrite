import { NextApiRequest, NextApiResponse } from 'next';
import type { DAS } from 'helius-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).send('Method not allowed.');

        return;
    }

    const {
        query: { address },
    } = req;

    console.log({ address });
    if (!address) {
        res.status(404).send('Missing address');
        return;
    }

    const HELIUS_API_KEY = process.env.NEXT_HELIUS_API_KEY;

    const url = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id2',
            method: 'getAssetsByOwner',
            params: {
                ownerAddress: address,
                page: 1,
                limit: 1000,
                sortBy: { sortBy: 'created', sortDirection: 'desc' },
            },
        }),
    });

    const { result }: { result?: DAS.GetAssetResponseList } = await response.json();

    res.json(result);
}
