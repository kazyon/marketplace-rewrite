export function isChildrenPageActive(path: string, match: string) {
    if (path && match) {
        return path === match;
    }
    return false;
}
