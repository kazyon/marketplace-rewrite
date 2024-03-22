export function truncateAddress(address: string, startLength = 15, endLength = 15) {
    if (!address || address.length <= startLength + endLength) {
        return address;
    }

    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength);

    return `${start}...${end}`;
}
