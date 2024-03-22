import { OrderSort } from '@/sections/marketplace/types';
import { useAuctionFilters } from '@/sections/marketplace/store/ahFiltersStore';
import { Dropdown, DropdownItem } from '@/shared/components/dropdown/Dropdown';
import React, { useMemo } from 'react';
import { FilterIcon } from '@/shared/components/svgs/FilterIcon';
import { initialFilters } from '@/sections/marketplace/config';
import classNames from 'classnames';

export type FilterSortHeaderProps = {
    orderOptions: DropdownItem<OrderSort>[];
};
export const FilterSortHeader = ({ orderOptions }: FilterSortHeaderProps) => {
    const filters = useAuctionFilters((state) => state.filters);
    const changeFilters = useAuctionFilters((state) => state.changeFilters);
    const resetFilters = useAuctionFilters((state) => state.resetFilters);
    const toggleSidebarOpen = useAuctionFilters((state) => state.toggleSidebarOpen);
    const sidebarOpen = useAuctionFilters((state) => state.sidebarOpen);
    const dropdownItemChange = (sortOrder: DropdownItem<OrderSort>) => {
        changeFilters({
            orderByKey: sortOrder.value.key,
            sortDirection: sortOrder.value.direction,
        });
    };

    const clearFilters = () => {
        resetFilters();
    };

    const selectedItem = useMemo(() => {
        return orderOptions
            .filter((option) => option.value.key === filters.orderByKey)
            .find((order) => order.value.direction === filters.sortDirection);
    }, [filters]);

    console.log({ initialFilters, filters });

    const areInitialFilters = useMemo(() => {
        return JSON.stringify(initialFilters) === JSON.stringify(filters);
    }, [filters]);

    return (
        <div className={'flex flex-wrap justify-between'}>
            <div className="flex space-x-2 mb-2">
                <button
                    onClick={toggleSidebarOpen}
                    className="flex h-10 group flex-shrink-0 items-center justify-center space-x-1 rounded-lg border border-jacarta-100 bg-white py-1.5 px-4 font-display text-sm font-semibold text-jacarta-500 hover:bg-accent hover:border-accent dark:hover:bg-accent dark:border-jacarta-600 dark:bg-jacarta-700"
                >
                    <FilterIcon className="h-4 w-4 fill-jacarta-700 dark:fill-white group-hover:fill-white" />
                    <span className="mt-0.5 dark:text-white group-hover:text-white">
                        {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                    </span>
                </button>
                <button
                    onClick={clearFilters}
                    className={classNames(
                        'lex h-10 group flex-shrink-0 items-center justify-center space-x-1 rounded-lg border border-jacarta-100 bg-white py-1.5 px-4 font-medium text-2xs hover:bg-accent hover:border-accent dark:hover:bg-accent dark:border-jacarta-600 dark:bg-jacarta-700',
                        {
                            hidden: areInitialFilters,
                        }
                    )}
                >
                    <span className="mt-0.5 dark:text-white group-hover:text-white">Clear All</span>
                </button>
            </div>
            {selectedItem && (
                <Dropdown
                    noSelectionLabel={''}
                    options={orderOptions}
                    selectedItem={selectedItem}
                    onChange={dropdownItemChange}
                />
            )}
        </div>
    );
};
