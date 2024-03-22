import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';
import { WithInjectedNftMetadata } from '@/shared/components/inject-metadata-hoc/WithInjectedNftMetadata';
import { NftWithCollectionStatus } from '@/requests/queries/getAllNfts';
import Skeleton from 'tiny-skeleton-loader-react';
import { CaretDownIcon } from '@/shared/components/svgs/CaretDownIcon';
import { CheckmarkIcon } from '@/shared/components/svgs/CheckmarkIcon';

interface CollectionDropdownProps {
    collections?: NftWithCollectionStatus[] | null;
    selectedItem?: string | null;
    onChange: (collection: NftWithCollectionStatus) => void;
}
const SelectCollectionDropdown = ({
    collections,
    onChange = () => {},
    selectedItem = null,
}: CollectionDropdownProps) => {
    const [dropdown, setDropdown] = useState(false);
    const listRef = useRef(null);
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

    const selectedCollection = collections?.find((collection) => collection.id === selectedItem);

    return (
        <>
            <div
                className={
                    dropdown
                        ? 'overlay h-[100vh] dropdown-toggle w-[100vw] fixed top-0 left-0 opacity-0 show bg-red-500 z-40 cursor-default'
                        : 'overlay h-[100vh] w-[100vw] fixed top-0 left-0 opacity-0 hidden bg-red-500 z-40 cursor-default'
                }
                onClick={() => handleDropdown()}
            ></div>

            <div
                className={classNames(
                    ` dark:bg-jacarta-700 dropdown-toggle border-jacarta-100 dark:border-jacarta-600 dark:text-jacarta-300 flex items-center rounded-lg border bg-white py-3 px-3 show z-50 relative pl-7`,
                    {
                        ['dark:text-white']: selectedItem,
                    }
                )}
                onClick={() => handleDropdown()}
            >
                {selectedCollection?.content?.json_uri ? (
                    <WithInjectedNftMetadata
                        metadataUri={selectedCollection?.content?.json_uri}
                        loadingComponent={<Skeleton background="#676767" height={230} />}
                    >
                        {(metadata) => {
                            return (
                                <img
                                    width={32}
                                    height={32}
                                    src={metadata.image}
                                    className="h-8 w-8 rounded-full"
                                    alt="avatar"
                                />
                            );
                        }}
                    </WithInjectedNftMetadata>
                ) : null}

                <span className="mx-2">
                    {selectedCollection ? selectedCollection?.content?.metadata.name : 'Select collection'}
                </span>
                <CaretDownIcon className="ml-auto fill-jacarta-500 h-4 w-4 dark:fill-white" />
            </div>

            <div
                className={
                    dropdown
                        ? 'absolute dark:bg-jacarta-800 whitespace-nowrap w-full rounded-xl bg-white py-4 px-2 text-left shadow-xl show z-50'
                        : 'absolute dark:bg-jacarta-800 whitespace-nowrap w-full rounded-xl bg-white py-4 px-2 text-left shadow-xl hidden z-50'
                }
            >
                <ul
                    className="flex max-h-48 flex-col overflow-y-auto dark:bg-jacarta-700 dropdown-toggle dark:border-jacarta-600 dark:text-jacarta-300 rounded-lg border"
                    ref={listRef}
                >
                    {collections?.map((collection) => {
                        return (
                            <li key={collection.id}>
                                <button
                                    className="dropdown-item font-display dark:hover:bg-jacarta-600 hover:bg-jacarta-50 flex w-full items-center justify-between rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
                                    onClick={() => {
                                        onChange(collection);
                                    }}
                                >
                                    <span className="flex items-center space-x-3">
                                        <InView triggerOnce={true} ref={listRef}>
                                            {({ inView, ref }) => {
                                                return (
                                                    <div ref={ref}>
                                                        {inView ? (
                                                            <WithInjectedNftMetadata
                                                                metadataUri={collection?.content?.json_uri}
                                                                loadingComponent={
                                                                    <Skeleton background="#676767" height={230} />
                                                                }
                                                            >
                                                                {(metadata) => (
                                                                    <img
                                                                        width={32}
                                                                        height={32}
                                                                        src={metadata.image}
                                                                        className="h-8 w-8 rounded-full"
                                                                        alt="avatar"
                                                                    />
                                                                )}
                                                            </WithInjectedNftMetadata>
                                                        ) : null}
                                                    </div>
                                                );
                                            }}
                                        </InView>

                                        <span className="text-jacarta-700 dark:text-white">
                                            {collection?.content?.metadata.name}
                                        </span>
                                    </span>
                                    {selectedItem === collection.id && (
                                        <CheckmarkIcon className="fill-accent mb-[3px] h-4 w-4" />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default SelectCollectionDropdown;
