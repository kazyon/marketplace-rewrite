import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { CaretDownIcon } from '@/shared/components/svgs/CaretDownIcon';
import { CheckmarkIcon } from '@/shared/components/svgs/CheckmarkIcon';
import { useClickOutside } from '@/shared/hooks/useClickOutside';

export type DropdownItem<T> = {
    label: string;
    id: string;
    value?: T;
};

type DropdownProps<T> = {
    selectedItem: DropdownItem<T> | null;
    options: DropdownItem<T>[];
    onChange: (item: DropdownItem<T>) => void;
    disabled?: boolean;
    loading?: boolean;
    noSelectionLabel: string | React.ReactElement;
};
export function Dropdown<T>({
    selectedItem,
    options,
    onChange,
    disabled = false,
    loading = false,
    noSelectionLabel,
}: DropdownProps<T>) {
    const [dropdown, setDropdown] = useState(false);
    const listRef = useRef(null);

    const handleClose = () => {
        setDropdown(false);
    };
    const domNode = useClickOutside(handleClose);

    return (
        <div className="relative" ref={domNode}>
            <div
                className={classNames(
                    `dark:bg-jacarta-700 border-jacarta-100 dark:border-jacarta-600 dark:text-jacarta-300 flex items-center rounded-lg border bg-white py-3 px-3 show relative pl-7 cursor-pointer`,
                    {
                        ['dark:text-white']: selectedItem,
                    }
                )}
                onClick={() => {
                    setDropdown((prevState) => !prevState);
                }}
            >
                <span className="mx-2">{selectedItem ? selectedItem.label : noSelectionLabel}</span>
                <CaretDownIcon className="ml-auto fill-jacarta-500 h-4 w-4 dark:fill-white" />
            </div>

            <div
                className={classNames(
                    'absolute dark:bg-jacarta-800 whitespace-nowrap w-full rounded-xl bg-white py-4 px-2 text-left shadow-xl z-50 border-2 border-jacarta-600',
                    {
                        show: dropdown,
                        hidden: !dropdown,
                    }
                )}
            >
                <ul className="flex max-h-48 flex-col overflow-y-auto" ref={listRef}>
                    {options?.map((option) => {
                        return (
                            <li key={option.id}>
                                <button
                                    className="dropdown-item font-display dark:hover:bg-jacarta-600 hover:bg-jacarta-50 flex w-full items-center justify-between rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
                                    onClick={() => {
                                        onChange(option);
                                        setDropdown(false);
                                    }}
                                >
                                    <span className="flex items-center space-x-3">
                                        <span className="text-jacarta-700 dark:text-white">{option.label}</span>
                                    </span>
                                    {selectedItem?.id === option.id && (
                                        <CheckmarkIcon className={classNames('fill-accent mb-[3px] h-4 w-4')} />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
