import { NextApiRequest, NextApiResponse } from 'next';
import type { DAS } from 'helius-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('getAssetBatch');
    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed.');

        return;
    }

    const {
        body: { mintList },
    } = req;

    console.log({ mintList });
    if (!mintList) {
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
            id: 'anft-test',
            method: 'getAssetBatch',
            params: {
                ids: mintList,
            },
        }),
    });
    const result: DAS.GetAssetResponse[] = await response.json();

    res.json(result);
}
