import { useAuctionFilters } from '@/sections/marketplace/store/ahFiltersStore';
import classNames from 'classnames';
import { CaretDownIcon } from '@/shared/components/svgs/CaretDownIcon';
import React from 'react';
import Collapsable from '@/shared/components/collapsable/Collapsable';

export type FiltersSidebarProps = {
    categories: string[];
    fileTypes: string[];
};
export const FiltersSidebar = ({ categories, fileTypes }: FiltersSidebarProps) => {
    const filters = useAuctionFilters((state) => state.filters);
    const changeFilters = useAuctionFilters((state) => state.changeFilters);
    const sidebarOpen = useAuctionFilters((state) => state.sidebarOpen);

    const onCategoryChange = (selectedCategory: string) => {
        const isInCategoryList = filters.categories.includes(selectedCategory);
        if (isInCategoryList) {
            changeFilters({
                categories: filters.categories.filter((filterCategory) => filterCategory !== selectedCategory),
            });
        } else {
            changeFilters({
                categories: [...filters.categories, selectedCategory],
            });
        }
    };

    const onFileTypeChange = (selectedFileType: string) => {
        const isInFileTypeList = filters.fileTypes.includes(selectedFileType);
        if (isInFileTypeList) {
            changeFilters({
                fileTypes: filters.fileTypes.filter((filterCategory) => filterCategory !== selectedFileType),
            });
        } else {
            changeFilters({
                fileTypes: [...filters.fileTypes, selectedFileType],
            });
        }
    };

    return (
        <>
            <div
                className={classNames(
                    'lg:w-1/5 mb-10 lg:h-[calc(100vh_-_232px)] custom-border-y lg:overflow-auto lg:sticky lg:top-32 lg:mr-12 pr-4 pl-4 dark:divide-jacarta-600',
                    {
                        hidden: !sidebarOpen,
                    }
                )}
            >
                <Collapsable>
                    <div className="mt-4 pt-4">
                        <Collapsable.Header>
                            {(isOpen) => (
                                <h2>
                                    <button
                                        className="relative flex w-full items-center justify-between py-3 text-left font-display text-xl text-jacarta-700 dark:text-white"
                                        type="button"
                                    >
                                        <span>Asset Type</span>
                                        <CaretDownIcon
                                            className={classNames('fill-jacarta-200', {
                                                'rotate-180': isOpen,
                                            })}
                                        />
                                    </button>
                                </h2>
                            )}
                        </Collapsable.Header>
                        <Collapsable.Content>
                            <div className="mt-3">
                                <ul className="flex flex-wrap items-center">
                                    {fileTypes.map((fileType) => {
                                        const isSelected = filters.fileTypes.includes(fileType);
                                        return (
                                            <li className="my-1 mr-2.5" key={fileType}>
                                                <button
                                                    className={classNames(
                                                        `capitalize flex h-9 items-center rounded-lg border border-jacarta-100 bg-white text-jacarta-600-500 px-4 font-display text-sm font-semibold transition-colors hover:border-transparent hover:bg-accent hover:text-white dark:border-jacarta-600 dark:text-white dark:hover:border-transparent dark:hover:bg-accent dark:hover:text-white`,
                                                        {
                                                            'dark:bg-accent-dark': isSelected,
                                                            'dark:bg-jacarta-900': !isSelected,
                                                        }
                                                    )}
                                                    onClick={() => onFileTypeChange(fileType)}
                                                >
                                                    <span>{fileType}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </Collapsable.Content>
                    </div>
                </Collapsable>

                <Collapsable>
                    <div className="mt-4 pt-4">
                        <Collapsable.Header>
                            {(isOpen) => (
                                <h2>
                                    <button
                                        className="relative flex w-full items-center justify-between py-3 text-left font-display text-xl text-jacarta-700 dark:text-white"
                                        type="button"
                                    >
                                        <span>Categories</span>
                                        <CaretDownIcon
                                            className={classNames('fill-jacarta-200', {
                                                'rotate-180': isOpen,
                                            })}
                                        />
                                    </button>
                                </h2>
                            )}
                        </Collapsable.Header>
                        <Collapsable.Content>
                            <div className="mt-3">
                                <ul className="flex flex-wrap items-center">
                                    {categories.map((category) => {
                                        const isSelected = filters.categories.includes(category);
                                        return (
                                            <li className="my-1 mr-2.5" key={category}>
                                                <button
                                                    className={classNames(
                                                        `flex h-9 items-center rounded-lg border border-jacarta-100 bg-white text-jacarta-600-500 px-4 font-display text-sm font-semibold transition-colors hover:border-transparent hover:bg-accent hover:text-white dark:border-jacarta-600 dark:text-white dark:hover:border-transparent dark:hover:bg-accent dark:hover:text-white`,
                                                        {
                                                            'dark:bg-accent-dark': isSelected,
                                                            'dark:bg-jacarta-900': !isSelected,
                                                        }
                                                    )}
                                                    onClick={() => onCategoryChange(category)}
                                                >
                                                    <span>{category}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </Collapsable.Content>
                    </div>
                </Collapsable>
            </div>
        </>
    );
};
