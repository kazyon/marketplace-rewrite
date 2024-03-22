export const fetchMetadata = async (uri?: string) => {
    if (!uri) {
        throw new Error();
    }
    const res = await fetch(uri);
    return await res.json();
};
