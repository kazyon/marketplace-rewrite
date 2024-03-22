import React, { useMemo, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getPubkeyFromUsername } from '@/requests/queries/getPubkeyFromUsername';
import { PriceIcon } from '@/shared/components/svgs/PriceIcon';
import { OwnedIcon } from '@/shared/components/svgs/OwnedIcon';
import { ListingIcon } from '@/shared/components/svgs/ListingIcon';
import CollectionsGrid from '@/sections/user/ components/CollectionsGrid';
import { getAllNfts, NftWithCollectionStatus } from '@/requests/queries/getAllNfts';
import { getAhItems } from '@/requests/queries/getAhItems';
import { getCollectionsByPubkey } from '@/requests/queries/getCollectionsByPubkey';
import NftsGrid from '@/shared/components/nfts-grid/nftsGrid';
import { AhListedItem } from '@/requests/validation_schemas';
import { getSoldAhItems } from '@/requests/queries/getSoldAhItems';
import { getNftDataByMintList } from '@/requests/queries/getNftDataByMintList';

export function combineNftsInfo(
    nfts: NftWithCollectionStatus[] | undefined,
    dbCollections: string[] | null | undefined,
    listedAhItems: AhListedItem[] | undefined
) {
    if (nfts && dbCollections && listedAhItems) {
        const uniqueElementsSet = new Set();
        const apiCollections = nfts
            .filter((nft) => nft.isCollection)
            .map((item) => item.id)
            .map((item) => item);
        apiCollections.forEach((item) => uniqueElementsSet.add(item));
        dbCollections.forEach((item) => uniqueElementsSet.add(item));

        const itemsWithCollection = nfts.map((nft) => {
            return {
                ...nft,
                isCollection: uniqueElementsSet.has(nft.id),
            };
        });

        const itemsWithAhStatus = itemsWithCollection.map((nft) => {
            const foundAhItem = listedAhItems.find((ahItem) => ahItem.mintAddress === nft.id);
            return {
                ...nft,
                isAhItem: !!foundAhItem,
                ahListing: foundAhItem,
            };
        });

        return itemsWithAhStatus;
    }

    return null;
}

const UserItemsTabs = () => {
    const [itemActive, setItemActive] = useState(1);

    const { query } = useRouter();
    const { username } = query;

    const {
        data: pubkey,
        isLoading: pubkeyLoading,
        isSuccess: isPubkeySuccess,
        isError: isPubkeyEror,
        refetch: refetchUsernameToPubkey,
        isRefetching: getPubkeyFromUsernameRefetching,
        isRefetchError: getPubkeyFromUsernameRefetchedError,
    } = useQuery({
        queryKey: ['usernameToPubkey', username],
        queryFn: () => getPubkeyFromUsername(username as string),
        staleTime: 0,
        enabled: !!username,
    });

    const {
        data: nfts,
        isLoading: nftsLoading,
        isSuccess: isNftsSuccess,
        isError: isNftsError,
        refetch: refetchGetAllNfts,
        isRefetching: getAllNftsRefetching,
        isRefetchError: getAllNftsRefetchError,
    } = useQuery({
        initialData: [],
        queryKey: ['nfts', pubkey],
        queryFn: () => getAllNfts(pubkey),
        staleTime: 0,
        enabled: !!pubkey,
    });

    const {
        data: listedAhItems,
        isLoading: listedAhItemsLoading,
        isSuccess: isListedAhItemsSuccess,
        isError: isListedAhItemsError,
        refetch: refetchGetAhItems,
        isRefetching: getAhItemsRefetching,
        isRefetchError: getAhItemsRefetchError,
    } = useQuery({
        initialData: [],
        queryKey: ['ah-items', pubkey],
        queryFn: () => getAhItems(pubkey),
        staleTime: 0,
        enabled: !!pubkey,
    });

    const {
        data: dbCollections,
        isLoading: dbCollectionsLoading,
        isSuccess: isDbCollectionsSuccess,
        isError: isDbCollectionsError,
        refetch: refetchGetCollectionsByPubkey,
        isRefetching: getCollectionsByPubkeyRefetching,
        isRefetchError: getCollectionsByPubkeyRefetchError,
    } = useQuery({
        initialData: [],
        queryKey: ['collections', pubkey],
        queryFn: () => getCollectionsByPubkey(pubkey as string),
        staleTime: 0,
        enabled: !!pubkey,
    });

    const {
        data: soldAhItems,
        isLoading: soldAhItemsLoading,
        isSuccess: soldAhItemsSuccess,
        isError: soldAhItemsError,
        refetch: refetchSoldAhItems,
        isRefetching: soldAhItemsRefreshing,
        isRefetchError: soldAhItemsRefreshError,
    } = useQuery({
        initialData: [],
        queryKey: ['sold-ah-items', pubkey],
        queryFn: () => getSoldAhItems(pubkey as string),
        staleTime: 0,
        enabled: !!pubkey,
    });

    const {
        data: soldAhItemsAssets,
        isLoading: soldAhItemsAssetsLoading,
        isSuccess: soldAhItemsAssetsSuccess,
        isError: soldAhItemsAssetssError,
        refetch: refetchSoldAhItemsAssets,
        isRefetching: soldAhItemsAssetssRefetching,
        isRefetchError: soldAhItemsAssetssRefechError,
    } = useQuery({
        initialData: [],
        queryKey: ['assets-batch', pubkey],
        queryFn: () => getNftDataByMintList(soldAhItems?.map((item) => item.mintAddress)),
        staleTime: 0,
        enabled: !!soldAhItems,
    });

    // combines the statuses for the requests into one boolean, so basically if any one of these request is loading
    // the whole "batch" is considered to be loaded, that's because there's some dependencies between the requests
    // (some of them depend on others)
    // same things applies to errors as well as success statuses
    const isRefetchError =
        getPubkeyFromUsernameRefetchedError ||
        getAllNftsRefetchError ||
        getAhItemsRefetchError ||
        getCollectionsByPubkeyRefetchError;
    const isCombinedRefetching =
        getPubkeyFromUsernameRefetching ||
        getAllNftsRefetching ||
        getAhItemsRefetching ||
        getCollectionsByPubkeyRefetching;
    const isCombinedLoading =
        isCombinedRefetching || pubkeyLoading || nftsLoading || listedAhItemsLoading || dbCollectionsLoading;
    const isCombinedSuccess = isPubkeySuccess && isNftsSuccess && isListedAhItemsSuccess && isDbCollectionsSuccess;
    const combinedError = isRefetchError || isPubkeyEror || isNftsError || isListedAhItemsError || isDbCollectionsError;

    const soldCombinedLoading =
        soldAhItemsAssetsLoading || soldAhItemsLoading || soldAhItemsAssetssRefetching || soldAhItemsRefreshing;
    const soldCombinedError =
        soldAhItemsError || soldAhItemsAssetssError || soldAhItemsRefreshError || soldAhItemsAssetssRefechError;
    const soldCombinedSuccess = soldAhItemsSuccess && soldAhItemsAssetsSuccess;

    const combinedNftsList = useMemo(() => {
        return combineNftsInfo(nfts, dbCollections, listedAhItems);
    }, [nfts, dbCollections, listedAhItems]);

    const ahListings = useMemo(() => {
        if (combinedNftsList) {
            return combinedNftsList.filter((nft) => nft.isAhItem);
        }
        return [];
    }, [combinedNftsList]);

    const individualNftsOwned = useMemo(() => {
        if (combinedNftsList) {
            return combinedNftsList.filter((nft) => !nft.isCollection);
        }
        return [];
    }, [combinedNftsList]);

    const collections = useMemo(() => {
        if (combinedNftsList) {
            return combinedNftsList.filter((nft) => nft.isCollection);
        }
        return [];
    }, [combinedNftsList]);

    const tabItem = [
        {
            id: 1,
            text: `Owned  ${isCombinedSuccess ? `(${individualNftsOwned.length})` : ''}`,
            icon: <OwnedIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
        {
            id: 2,
            text: `Collections ${isCombinedSuccess ? `(${collections.length})` : ''}`,
            icon: <ListingIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
        {
            id: 3,
            text: `On Sale ${isCombinedSuccess ? `(${ahListings.length})` : ''}`,
            icon: <PriceIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
        {
            id: 4,
            text: `Sold ${soldCombinedSuccess ? `(${soldAhItemsAssets?.length ?? 0})` : ''}`,
            icon: <PriceIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
    ];

    const batchRefresh = () => {
        refetchUsernameToPubkey();
        refetchGetAllNfts();
        refetchGetAhItems();
        refetchGetCollectionsByPubkey();
    };

    const batchRefreshSoldAhItems = () => {
        refetchSoldAhItemsAssets();
        refetchSoldAhItems();
    };

    return (
        <>
            <section className="relative py-24">
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
                <div className="container">
                    <Tabs className="tabs">
                        <TabList className="nav nav-tabs mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b-0 border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
                            {tabItem.map(({ id, text, icon }) => {
                                return (
                                    <Tab
                                        className="nav-item"
                                        role="presentation"
                                        key={id}
                                        onClick={() => setItemActive(id)}
                                    >
                                        <button
                                            className={
                                                itemActive === id
                                                    ? 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active'
                                                    : 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white'
                                            }
                                        >
                                            {icon}
                                            <span className="font-display text-base font-medium">{text}</span>
                                        </button>
                                    </Tab>
                                );
                            })}
                        </TabList>

                        <TabPanel>
                            <div>
                                {combinedError && !isCombinedLoading && (
                                    <div className="text-center text-red-400">
                                        Failed to fetch owned NFTs, click{' '}
                                        <span
                                            onClick={batchRefresh}
                                            className="text-accent hover:underline cursor-pointer"
                                        >
                                            here
                                        </span>{' '}
                                        to try again
                                    </div>
                                )}
                                {/*{!combinedError && !isCombinedLoading && collections.length === 0 ? (*/}
                                {/*    <div className={'text-center'}>User doesn't have any nfts</div>*/}
                                {/*) : null}*/}
                                <NftsGrid
                                    items={individualNftsOwned}
                                    isLoading={isCombinedLoading}
                                    isSuccess={isCombinedSuccess}
                                    isError={combinedError}
                                />
                            </div>
                        </TabPanel>

                        <TabPanel>
                            {combinedError && !isCombinedLoading && (
                                <div className="text-center text-red-400">
                                    Failed to fetch sold assets, click{' '}
                                    <span onClick={batchRefresh} className="text-accent hover:underline cursor-pointer">
                                        here
                                    </span>{' '}
                                    to try again
                                </div>
                            )}
                            {!combinedError && !isCombinedLoading && !isCombinedLoading && collections.length === 0 ? (
                                <div className={'text-center dark:text-white'}>
                                    User hasn't sold any items in the auction house
                                </div>
                            ) : null}

                            <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-3 lg:grid-cols-4">
                                <CollectionsGrid
                                    collections={collections}
                                    allNfts={combinedNftsList}
                                    isLoading={isCombinedLoading}
                                    isSuccess={isCombinedSuccess}
                                    isError={combinedError}
                                />
                            </div>
                        </TabPanel>

                        <TabPanel>
                            <div>
                                {combinedError && !isCombinedLoading && (
                                    <div className="text-center text-red-400">
                                        Failed to fetch active listings, click{' '}
                                        <span
                                            onClick={batchRefresh}
                                            className="text-accent hover:underline cursor-pointer"
                                        >
                                            here
                                        </span>{' '}
                                        to try again
                                    </div>
                                )}
                                {!combinedError && !isCombinedLoading && ahListings.length === 0 ? (
                                    <div className={'text-center dark:text-white'}>
                                        User doesn't have any assets currently listed on sale
                                    </div>
                                ) : null}
                                <NftsGrid
                                    items={ahListings}
                                    isLoading={isCombinedLoading}
                                    isSuccess={isCombinedSuccess}
                                    isError={combinedError}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            {soldCombinedError && !soldCombinedLoading && (
                                <div className="text-center text-red-400">
                                    Failed to sold assets, click{' '}
                                    <span
                                        onClick={batchRefreshSoldAhItems}
                                        className="text-accent hover:underline cursor-pointer"
                                    >
                                        here
                                    </span>{' '}
                                    to try again
                                </div>
                            )}
                            {!soldCombinedError && !soldCombinedLoading && soldAhItemsAssets?.length === 0 ? (
                                <div className={'text-center dark:text-white'}>User doesn't have any nfts</div>
                            ) : null}

                            <NftsGrid
                                items={soldAhItemsAssets}
                                isLoading={soldCombinedLoading}
                                isSuccess={soldCombinedSuccess}
                                isError={soldCombinedError}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
            </section>
        </>
    );
};

export default UserItemsTabs;
