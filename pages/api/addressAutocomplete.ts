import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export const autocompleteResponseSchema = z.object({
    status: z.string(),
    predictions: z.array(
        z.object({
            description: z.string(),
            place_id: z.string(),
        })
    ),
});

export type AutocompleteResponse = z.infer<typeof autocompleteResponseSchema>;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).send('Method not allowed.');

        return;
    }

    const {
        query: { searchQuery },
    } = req;

    if (!searchQuery || Array.isArray(searchQuery)) {
        res.status(404).send('searchQuery not present');
        return;
    }

    if (!process.env.NEXT_PLACES_AUTOCOMPLETE_API_KEY) {
        res.status(500).send('Something went wrong');
        throw new Error('Missing NEXT_PLACES_AUTOCOMPLETE_API_KEY env variable');
    }

    const searchParams = new URLSearchParams();
    searchParams.set('input', searchQuery);
    searchParams.set('key', process.env.NEXT_PLACES_AUTOCOMPLETE_API_KEY);

    const placeRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?${searchParams.toString()}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );

    console.time('Zod parse');
    const placesData: AutocompleteResponse = await placeRes.json();
    const parseResult = autocompleteResponseSchema.safeParse(placesData);
    console.timeEnd('Zod parse');

    if (placeRes.ok && placeRes.status >= 200 && placeRes.status < 300 && parseResult.success) {
        res.status(200).json(placesData);
    } else {
        res.status(500).send('Something went wrong');
    }
}
