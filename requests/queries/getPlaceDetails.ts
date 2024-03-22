import { DetailsResponse } from '@/pages/api/placeDetails';

export async function getPlaceDetails(placeId?: string) {
    if (!placeId) {
        throw new Error();
    }
    const placeRes = await fetch(`/api/placeDetails?placeId=${placeId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const response: DetailsResponse = await placeRes.json();
    return response;
}
