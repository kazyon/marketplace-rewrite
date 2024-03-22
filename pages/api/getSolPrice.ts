import { NextApiRequest, NextApiResponse } from 'next';

const ONE_MINUTE_IN_MS = 60_000;
const CACHE_TIME_IN_MS = ONE_MINUTE_IN_MS * 2;
let lastPrice: any = null;
let lastUpdate = new Date();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const currentTime = new Date();
        try {
            const timeSinceLastUpdate = currentTime.getTime() - lastUpdate.getTime();

            if (timeSinceLastUpdate > CACHE_TIME_IN_MS || lastPrice === null) {
                const priceRes = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,eur,gbp',
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );
                const priceJson = await priceRes.json();
                // const { success } = priceResSchema.safeParse(priceJson);

                if (priceJson) {
                    lastPrice = priceJson;
                    lastUpdate = currentTime;
                    console.log('made a request, from getSolPrice');
                    res.status(200).json(lastPrice);
                } else {
                    res.status(500).json({
                        message: 'Failed to fetch prices.',
                    });
                }
                return;
            }
        } catch {
            res.status(500).json({ message: 'Failed to fetch prices.' });
            return;
        }
        console.log('returned from cache, from getSolPrice');
        res.status(200).json(lastPrice);
    } else {
        res.status(405).json({ message: 'Method not supported' });
    }
}
