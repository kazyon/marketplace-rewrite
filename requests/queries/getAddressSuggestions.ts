import { AutocompleteResponse } from '@/pages/api/addressAutocomplete';

export async function getAddressSuggestions(query: string) {
    const placeRes = await fetch(`/api/addressAutocomplete?searchQuery=${query}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const res: AutocompleteResponse = await placeRes.json();
    return res;
}
