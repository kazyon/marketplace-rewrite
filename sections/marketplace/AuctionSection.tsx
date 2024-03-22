import NftsGrid from '@/shared/components/nfts-grid/nftsGrid';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { CloseIcon } from '@/shared/components/svgs/CloseIcon';
import { getNftDataByMintList } from '@/requests/queries/getNftDataByMintList';
import { AhListedItem } from '@/requests/validation_schemas';
import { getFilteredAhItems } from '@/requests/queries/getFilteredAhItems';
import Image from 'next/image';
import { useAuctionFilters } from '@/sections/marketplace/store/ahFiltersStore';
import { FiltersSidebar } from '@/sections/marketplace/components/FiltersSidebar';
import { FilterSortHeader } from '@/sections/marketplace/components/SortHeader';
import { possibleCategories, possibleFileTypes, sortingOptions } from '@/sections/marketplace/config';

export function AuctionSection() {
    const filters = useAuctionFilters((state) => state.filters);

    const {
        data: listedAhItems,
        isSuccess: listedAhItemsSuccess,
        isFetching: listedAhItemsLoading,
        isError: listedAhItemsError,
        isRefetchError: listedAhItemsRefetchError,
        refetch: refetchAuctionHouseItems,
    } = useQuery({
        keepPreviousData: false,
        queryKey: ['ah-items', filters],
        queryFn: () => getFilteredAhItems(filters),
        staleTime: 0,
        onError: () => {
            let toastId: undefined | string;
            toastId = toast.error(
                <div>
                    <div>Failed to fetch auction house items</div>
                    <div>
                        Click{' '}
                        <span
                            onClick={async () => {
                                await refetchAuctionHouseItems();
                            }}
                            className="text-accent hover:underline cursor-pointer"
                        >
                            here
                        </span>{' '}
                        to try again
                    </div>
                    <div onClick={() => toast.dismiss(toastId)}>
                        <CloseIcon />
                    </div>
                </div>,
                {
                    duration: 999999,
                    position: 'bottom-center',
                }
            );
        },
    });

    const {
        data: nftsData,
        isSuccess: nftsDataSuccess,
        isFetching: nftsDataLoading,
        isError: nftsDataError,
        isRefetchError: nftsDataRefetchError,
    } = useQuery({
        queryKey: ['auction-nft-data', listedAhItems],
        queryFn: () => getNftDataByMintList(listedAhItems?.map((item) => item.mintAddress)),
        staleTime: 0,
        keepPreviousData: true,
        enabled: Boolean(listedAhItemsSuccess && listedAhItems),
        onError: () => {
            let toastId: undefined | string;
            toastId = toast.error(
                <div>
                    <div>Failed to fetch auction house items</div>
                    <div>
                        Click{' '}
                        <span
                            onClick={async () => {
                                await refetchAuctionHouseItems();
                            }}
                            className="text-accent hover:underline cursor-pointer"
                        >
                            here
                        </span>{' '}
                        to try again
                    </div>
                    <div onClick={() => toast.dismiss(toastId)}>
                        <CloseIcon />
                    </div>
                </div>,
                {
                    duration: 999999,
                    position: 'bottom-center',
                }
            );
        },
    });

    const combinedLoading = listedAhItemsLoading || nftsDataLoading;
    const combinedError = listedAhItemsError || listedAhItemsRefetchError || nftsDataRefetchError || nftsDataError;
    const combinedSuccess = listedAhItemsSuccess && nftsDataSuccess;

    const nftsDataWithAhInfo = useMemo(() => {
        if (!listedAhItems || !nftsData) {
            return [];
        }
        const nfts: { [key: string]: AhListedItem } = {};
        for (let ahItem of listedAhItems) {
            nfts[ahItem.mintAddress] = ahItem;
        }

        return nftsData.map((nft) => {
            return { ...nft, ahListing: nfts[nft.id] };
        });
    }, [nftsData]);

    return (
        <section className="relative pt-16 pb-24">
            <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
                <Image
                    width={1519}
                    height={773}
                    priority
                    src="/images/gradient_light.jpg"
                    alt="gradient"
                    className="h-full w-full object-cover"
                />
            </picture>
            <div className="px-6 xl:px-24">
                <FilterSortHeader orderOptions={sortingOptions} />
                <div className={'lg:flex mt-6'}>
                    <FiltersSidebar fileTypes={possibleFileTypes} categories={possibleCategories} />
                    <div className="w-full">
                        <NftsGrid
                            rootClassName={'grid grid-cols-auto-fill-300 gap-4'}
                            items={nftsDataWithAhInfo}
                            isLoading={combinedLoading}
                            isSuccess={combinedSuccess}
                            isError={combinedError}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
