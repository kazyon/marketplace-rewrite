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
                const previousDate = new Date();
                previousDate.setDate(previousDate.getDate() - 1);
                const day = String(previousDate.getDate()).padStart(2, '0');
                const month = String(previousDate.getMonth() + 1).padStart(2, '0');
                const year = previousDate.getFullYear();
                const previousApiUrl = `https://api.coingecko.com/api/v3/coins/solana/history?date=${day}-${month}-${year}`;

                const priceRes = await fetch(previousApiUrl, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                });
                const priceJson = await priceRes.json();

                if (priceJson) {
                    lastPrice = priceJson;
                    lastUpdate = currentTime;
                    console.log('made a request, from getSolHistoricalPrice');
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
        console.log('returned from cache, from getSolHistoricalPrice');
        res.status(200).json(lastPrice);
    } else {
        res.status(405).json({ message: 'Method not supported' });
    }
}
