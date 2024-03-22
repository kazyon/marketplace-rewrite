interface SolPrice {
    solana: {
        usd: number;
        eur: number;
        gbp: number;
    };
}

export async function getSolPrice() {
    const placeRes = await fetch(`/api/getSolPrice`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const res: SolPrice = await placeRes.json();

    return res;
}
