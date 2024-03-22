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
                const currentDate = new Date();
                const day = String(currentDate.getDate()).padStart(2, '0');
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const year = currentDate.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;
                const apiUrl = `https://api.coingecko.com/api/v3/coins/solana/history?date=${formattedDate}`;

                const priceRes = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                });
                const priceJson = await priceRes.json();

                if (priceJson) {
                    lastPrice = priceJson;
                    lastUpdate = currentTime;
                    console.log('made a request, from getSolCoinHistory');
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
        console.log('returned from cache, from getSolCoinHistory');
        res.status(200).json(lastPrice);
    } else {
        res.status(405).json({ message: 'Method not supported' });
    }
}
