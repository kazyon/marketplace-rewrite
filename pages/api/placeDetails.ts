import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export const detailsResponseSchema = z.object({
    status: z.string(),
    result: z.object({
        formatted_address: z.string(),
        geometry: z.object({
            location: z.object({
                lat: z.number(),
                lng: z.number(),
            }),
        }),
        address_components: z.array(
            z.object({
                long_name: z.string(),
                short_name: z.string(),
                types: z.array(z.string()),
            })
        ),
    }),
});

export type DetailsResponse = z.infer<typeof detailsResponseSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const {
            query: { placeId },
        } = req;

        if (!placeId || Array.isArray(placeId)) {
            res.status(404).send('searchQuery not present');
            return;
        }

        if (!process.env.NEXT_PLACES_AUTOCOMPLETE_API_KEY) {
            res.status(500).send('Something went wrong');
            throw new Error('Missing NEXT_PLACES_AUTOCOMPLETE_API_KEY env variable');
        }

        const searchParams = new URLSearchParams();
        searchParams.set('place_id', placeId);
        searchParams.set('fields', 'geometry,formatted_address,address_components');
        // searchParams.set('radius', '500');
        searchParams.set('key', process.env.NEXT_PLACES_AUTOCOMPLETE_API_KEY);

        const placeRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?${searchParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        const placesData: DetailsResponse = await placeRes.json();

        console.time('placeDetails.ts parsed response time');
        const parsedResponse = detailsResponseSchema.safeParse(placesData);
        console.timeEnd('placeDetails.ts parsed response time');

        if (placeRes.ok && placeRes.status >= 200 && placeRes.status < 300 && parsedResponse.success) {
            res.status(200).json(placesData);
            return;
        }

        res.status(500).send('Something went wrong');
    } else {
        res.status(405).send('Method not allowed.');
    }
}
