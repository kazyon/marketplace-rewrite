export enum OrderableKeys {
    price = 'price',
    listedAt = 'listedAt',
}

export enum SortableTypes {
    asc = 'asc',
    desc = 'desc',
}

export type OrderSort = {
    direction: SortableTypes;
    key: OrderableKeys;
};

export type AhFilters = {
    categories: string[];
    fileTypes: string[];
    orderByKey: OrderableKeys;
    sortDirection: SortableTypes;
};
