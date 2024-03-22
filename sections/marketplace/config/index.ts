import { DropdownItem } from '@/shared/components/dropdown/Dropdown';
import { OrderableKeys, OrderSort, SortableTypes } from '@/sections/marketplace/types';

export const sortingOptions: DropdownItem<OrderSort>[] = [
    {
        label: 'Price (Asc)',
        id: '1',
        value: {
            direction: SortableTypes.asc,
            key: OrderableKeys.price,
        },
    },
    {
        label: 'Price (Desc)',
        id: '2',
        value: {
            direction: SortableTypes.desc,
            key: OrderableKeys.price,
        },
    },
    {
        label: 'Listed At (Asc)',
        id: '3',
        value: {
            direction: SortableTypes.asc,
            key: OrderableKeys.listedAt,
        },
    },
    {
        label: 'Listed At (Desc)',
        id: '4',
        value: {
            direction: SortableTypes.desc,
            key: OrderableKeys.listedAt,
        },
    },
];

export const possibleCategories = ['Art', 'Collectibles', 'Music', 'Video', 'Photography', 'Gaming', 'Memes'];
export const possibleFileTypes = ['video', 'audio', '3D', 'image'];

export const initialFilters = {
    categories: [],
    fileTypes: [],
    orderByKey: OrderableKeys.listedAt,
    sortDirection: SortableTypes.desc,
};
