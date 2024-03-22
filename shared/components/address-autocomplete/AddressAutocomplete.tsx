import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { useQuery } from 'react-query';
import { getAddressSuggestions } from '@/requests/queries/getAddressSuggestions';
import { getPlaceDetails } from '@/requests/queries/getPlaceDetails';

export interface PlaceDetails {
    addressAsString: string;
    placeId?: string;
    lat?: string;
    long?: string;
    addressComponents?: {
        long_name: string;
        short_name: string;
        types: string[];
    }[];
}
interface AutocompleteAddressProps {
    onChange: (placeDetails: Partial<PlaceDetails>) => void;
    inputClassName?: string;
    placeholder?: string;
    disabled?: boolean;
    initialValue?: string;
}

interface SelectedValue {
    place_id: string;
    description: string;
}
export const AutocompleteAddress = ({
    onChange,
    placeholder = 'Address',
    inputClassName,
    disabled = false,
    initialValue = '',
}: AutocompleteAddressProps) => {
    const [inputTextValue, setInputTextValue] = useState(initialValue);

    useEffect(() => {
        if (initialValue) {
            setInputTextValue(initialValue);
        }
    }, [initialValue]);

    const inputTextValueRef = useRef('');
    inputTextValueRef.current = inputTextValue;

    const [selectedItem, setSelectedItem] = useState<SelectedValue>();
    const [hasChanged, setHasChanged] = useState(false);
    const [dropdown, setDropdown] = useState(true);

    const handleDropdown = () => {
        window.addEventListener('click', (w) => {
            const target = w.target as HTMLElement | undefined;
            if (target?.closest('.dropdown-toggle')) {
                if (dropdown) {
                    setDropdown(false);
                } else {
                    setDropdown(true);
                }
            } else {
                setDropdown(false);
            }
        });
    };

    const { data: suggestions, refetch } = useQuery({
        queryKey: ['suggestions'],
        queryFn: () => getAddressSuggestions(inputTextValue),
        cacheTime: 1000 * 60,
        enabled: !!inputTextValue && inputTextValue.length > 3,
    });

    const items = useMemo(() => {
        const trimmed = inputTextValue.trim();
        if (!suggestions || !trimmed || trimmed.length < 3) {
            return [];
        }
        return suggestions.predictions;
    }, [suggestions, inputTextValue]);

    useQuery({
        queryKey: ['details', selectedItem?.place_id],
        queryFn: () => getPlaceDetails(selectedItem?.place_id),
        cacheTime: 1000 * 60,
        onSuccess: (detailsValue) => {
            const changeData: PlaceDetails = {
                addressAsString: inputTextValue,
                lat: String(detailsValue.result.geometry.location.lat),
                long: String(detailsValue.result.geometry.location.lng),
                placeId: selectedItem?.place_id,
                addressComponents: detailsValue.result.address_components,
            };

            onChange(changeData);
        },
        enabled: !!selectedItem?.place_id,
    });

    function onSelect(item: SelectedValue) {
        setHasChanged(false);
        setDropdown(false);
        setSelectedItem(item);
        setInputTextValue(item.description);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        // onChange({ addresAsString: e.target.value });
        setHasChanged(true);
        setInputTextValue(e.target.value);
        setDropdown(true);
        handleSearchDebounced();
    }
    const listRef = useRef(null);

    const handleOnSearch = async () => {
        onChange({
            addressAsString: inputTextValueRef.current,
        });

        const trimmed = inputTextValueRef.current.trim();
        if (trimmed.length > 3) {
            refetch();
        }
    };

    const handleSearchDebounced = useCallback(debounce(handleOnSearch, 500), []);

    return (
        <div className="form-group">
            <>
                <div
                    className={
                        dropdown
                            ? 'fixed inset-0 overlay dropdown-toggle opacity-0 show bg-red-500 z-40 cursor-default'
                            : 'fixed inset-0 overlay opacity-0 hidden bg-red-500 z-40 cursor-default'
                    }
                    onClick={() => handleDropdown()}
                ></div>

                <input
                    onClick={() => handleDropdown()}
                    value={inputTextValue}
                    disabled={disabled}
                    onChange={handleChange}
                    type="text"
                    id="item-name"
                    name={'Address'}
                    className={inputClassName || 'normal-case'}
                    placeholder={placeholder}
                    autoComplete="new-password"
                />

                <div
                    className={classNames(`relative`, {
                        hidden: items?.length === 0,
                    })}
                >
                    <div
                        className={
                            dropdown && hasChanged
                                ? 'absolute dark:bg-jacarta-800 whitespace-nowrap w-full rounded-xl bg-white py-4 px-2 text-left shadow-xl show z-50 border-2 border-jacarta-600'
                                : 'absolute dark:bg-jacarta-800 whitespace-nowrap w-full rounded-xl bg-white py-4 px-2 text-left shadow-xl hidden z-50 border-2 border-jacarta-600'
                        }
                    >
                        <ul className="flex max-h-48 flex-col overflow-y-auto" ref={listRef}>
                            {items?.map((item) => {
                                return (
                                    <li key={item.place_id}>
                                        <button
                                            className="dropdown-item font-display dark:hover:bg-jacarta-600 hover:bg-jacarta-50 flex w-full items-center justify-between rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
                                            onClick={() => {
                                                onSelect(item);
                                            }}
                                        >
                                            <span className="flex items-center space-x-3">
                                                <span className="text-jacarta-700 dark:text-white">
                                                    {item.description}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </>
        </div>
    );
};
