import { WithInjectedNftMetadata } from '@/shared/components/inject-metadata-hoc/WithInjectedNftMetadata';
import Skeleton from 'tiny-skeleton-loader-react';
import classNames from 'classnames';
import { CreatorOwnerSmallDetails } from '@/shared/components/creator-owner-small-details/CreatorOwnerSmallDetails';
import { CollectionProperties } from '@/sections/collection/components/CollectionProperties';
import SocialShare from '@/shared/components/social-share/SocialShare';
import { Heading } from '@/shared/components/heading/Heading';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import NftsGrid from '@/shared/components/nfts-grid/nftsGrid';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { fetchNftInfo } from '@/requests/queries/fetchNftInfo';
import { getCollectionsItems } from '@/requests/queries/getCollectionsItems';
import { OwnedIcon } from '@/shared/components/svgs/OwnedIcon';
import { ListingIcon } from '@/shared/components/svgs/ListingIcon';

export const CollectionSection = () => {
    const router = useRouter();
    const [itemActive, setItemActive] = useState(1);

    const collectionKey = typeof router.query.address === 'string' ? router.query.address : '';

    const {
        data: collectionInfo,
        isFetching: collectionInfoLoading,
        isSuccess: collectionInfoSuccess,
        isError: collectionInfoError,
        isRefetchError: collectionInfoRefetchError,
        refetch: refetchCollectionInfo,
    } = useQuery({
        queryKey: ['nft-item', collectionKey],
        queryFn: () => fetchNftInfo(collectionKey),
        staleTime: 0,
        enabled: Boolean(collectionKey),
    });

    console.log({ collectionInfoLoading });

    const {
        data: collectionItemsResponse,
        isFetching: collectionItemsLoading,
        isError: collectionItemsError,
        isRefetchError: collectionRefetchError,
        isFetched: collectionItemsFetched,
        refetch: refetchCollectionItems,
        isSuccess: collectionItemsResponseSuccess,
    } = useQuery({
        queryKey: ['collection-items', collectionKey],
        queryFn: () => getCollectionsItems(collectionInfo?.id),
        staleTime: 0,
        enabled: Boolean(collectionInfo?.id),
    });

    console.log({ collectionItemsError, collectionRefetchError });

    const combinedLoading = collectionInfoLoading || collectionItemsLoading;
    const combinedError =
        collectionInfoError || collectionInfoRefetchError || collectionItemsError || collectionRefetchError;

    const collectionItems = collectionItemsResponse?.items ?? [];

    const ownerAddress = collectionInfo?.ownership?.owner;
    const creatorInfo = collectionInfo?.creators?.[0];

    const ownerCollectionItems = useMemo(() => {
        if (collectionItemsResponse) {
            return collectionItemsResponse.items.filter((item) => item.ownership.owner === ownerAddress);
        }

        return [];
    }, [collectionItemsResponse]);

    const tabItem = [
        {
            id: 1,
            text: `All Items ${
                collectionItemsResponseSuccess && !collectionItemsLoading ? `(${collectionItems?.length})` : ''
            }`,
            icon: <OwnedIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
        {
            id: 2,
            text: `Owned by current owner ${
                collectionItemsResponseSuccess && !collectionItemsLoading ? `(${ownerCollectionItems?.length})` : ''
            }`,
            icon: <ListingIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
    ];

    function refetchCollections() {
        refetchCollectionItems();
    }
    return (
        <>
            {' '}
            {/*<button onClick={refetchCollectionInfo}>asdas</button>*/}
            <section className="dark:bg-jacarta-800 bg-light-base relative pb-12">
                <WithInjectedNftMetadata metadataUri={collectionInfo?.content?.json_uri} withoutLoading>
                    {(metadata, isLoading, isError, isSuccess) => {
                        return (
                            <>
                                {(isLoading || collectionInfoLoading) && <Skeleton background="#676767" height={500} />}
                                {isSuccess && collectionInfoSuccess && !collectionInfoLoading && (
                                    <div
                                        className={classNames(
                                            'absolute top-0 w-full items-center justify-center overflow-hidden',
                                            {
                                                'h-0': !metadata?.coverImage,
                                                'h-[500px]': !!metadata?.coverImage,
                                            }
                                        )}
                                    >
                                        {!!metadata?.coverImage && (
                                            <img
                                                src={metadata.coverImage}
                                                alt="banner"
                                                className="inset-0 absolute object-cover w-full h-full"
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="w-full flex items-center justify-center relative ">
                                    {(isLoading || collectionInfoLoading) && (
                                        <div className="max-w-[90vw] w-[500px] dark:border-jacarta-600 rounded-xl drop-shadow-lg translate-y-[-33%] flex justify-center">
                                            <Skeleton background="#676767" width={300} height={300} />
                                        </div>
                                    )}
                                    {isSuccess && collectionInfoSuccess && !collectionInfoLoading && (
                                        <figure
                                            className={classNames(
                                                'max-w-[90vw] w-[500px] dark:border-jacarta-600 rounded-xl drop-shadow-lg',
                                                {
                                                    'h-[200px] mt-[100px]': !metadata?.coverImage,
                                                    'mt-[500px] translate-y-[-33%]': !!metadata?.coverImage,
                                                }
                                            )}
                                        >
                                            <img
                                                width={300}
                                                height={300}
                                                src={metadata?.image}
                                                alt={`NFT name: ${metadata?.name}`}
                                                className="object-cover w-full h-full rounded-xl border-2 border-white"
                                            />
                                        </figure>
                                    )}
                                </div>
                            </>
                        );
                    }}
                </WithInjectedNftMetadata>

                <div className="container">
                    <div className="text-center">
                        <h2 className="font-display text-jacarta-700 mb-2 text-4xl font-medium dark:text-white">
                            {collectionInfoLoading && (
                                <Skeleton
                                    style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                    }}
                                    background="#676767"
                                    width={300}
                                />
                            )}
                            {collectionInfoSuccess && !collectionInfoLoading && collectionInfo?.content?.metadata?.name}
                        </h2>
                        <div className="w-full flex flex-col gap-2 items-center justify-center">
                            {collectionInfoLoading && <Skeleton background="#676767" width={300} />}
                            {collectionInfoLoading && <Skeleton background="#676767" width={300} />}
                        </div>
                        {collectionInfoSuccess && !collectionInfoLoading && (
                            <p className="dark:text-jacarta-300 mx-auto max-w-xl text-lg">
                                {collectionInfo?.content?.metadata.description}
                            </p>
                        )}
                        <div className="flex flex-col gap-4 items-center justify-center my-6">
                            <div className="flex justify-center">
                                {collectionInfoLoading && (
                                    <div>
                                        <Skeleton width={300} background="#676767" style={{ marginTop: '0.5em' }} />
                                        <Skeleton width={300} background="#676767" style={{ marginTop: '0.5em' }} />
                                    </div>
                                )}
                                {collectionInfoSuccess &&
                                creatorInfo?.address &&
                                ownerAddress &&
                                !collectionInfoLoading ? (
                                    <CreatorOwnerSmallDetails
                                        creatorInfo={creatorInfo}
                                        collectionInfoSuccess={collectionInfoSuccess}
                                        ownerAddress={creatorInfo.address}
                                        title={<>Creator {creatorInfo?.address === ownerAddress && '/Owner'}</>}
                                    />
                                ) : null}
                            </div>
                            {ownerAddress !== creatorInfo?.address && (
                                <div className="flex justify-center">
                                    {ownerAddress !== creatorInfo?.address &&
                                        ownerAddress &&
                                        creatorInfo &&
                                        !collectionInfoLoading && (
                                            <CreatorOwnerSmallDetails
                                                creatorInfo={creatorInfo}
                                                collectionInfoSuccess={collectionInfoSuccess}
                                                ownerAddress={ownerAddress}
                                                title={'Owner'}
                                                hideVerification
                                            />
                                        )}
                                </div>
                            )}
                        </div>

                        <div
                            className={classNames(
                                'grid-col-2 dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex flex-wrap items-center justify-center rounded-xl',
                                {
                                    'border bg-white': collectionItemsResponseSuccess,
                                }
                            )}
                        >
                            <>
                                {collectionItemsLoading && <Skeleton background="#676767" width={150} height={100} />}
                                {collectionItems &&
                                    !collectionItemsLoading &&
                                    !collectionInfoLoading &&
                                    !collectionItemsError &&
                                    !collectionRefetchError && (
                                        <div
                                            className={classNames(
                                                'dark:border-jacarta-600 border-jacarta-100 rounded-l-xl p-4 hover:shadow-md',
                                                {
                                                    'border-r': false,
                                                }
                                            )}
                                        >
                                            <div className="text-jacarta-700 mb-1 text-base font-bold dark:text-white">
                                                {collectionItems?.length} items
                                            </div>
                                            <div className="text-2xs dark:text-jacarta-400 font-medium tracking-tight">
                                                Total
                                            </div>
                                        </div>
                                    )}
                            </>
                        </div>
                        <div className="w-full flex items-center justify-center flex-col">
                            {!collectionInfoLoading &&
                            collectionInfoSuccess &&
                            collectionInfo?.content?.metadata?.attributes?.length ? (
                                <h2
                                    className={
                                        'font-display text-jacarta-700 mb-2 text-2xl font-medium dark:text-white '
                                    }
                                >
                                    Properties
                                </h2>
                            ) : null}

                            <CollectionProperties
                                isLoading={collectionInfoLoading}
                                className={'w-full'}
                                properties={collectionInfo?.content?.metadata?.attributes || []}
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-center space-x-2.5 relative">
                            {collectionInfoLoading || collectionInfoError || collectionInfoRefetchError ? null : (
                                <SocialShare />
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <div className="container">
                <Heading
                    text={
                        <>
                            <div>Collection NFTs</div>
                        </>
                    }
                    classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white mt-12 mb-6"
                />

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
                        <div className="relative">
                            {combinedError && !combinedLoading && (
                                <div className="text-center text-red-400">
                                    Failed to fetch collections, click{' '}
                                    <span
                                        onClick={refetchCollections}
                                        className="text-accent hover:underline cursor-pointer"
                                    >
                                        here
                                    </span>{' '}
                                    to try again
                                </div>
                            )}
                            {!combinedError && !combinedLoading && ownerCollectionItems.length === 0 ? (
                                <div className={'text-center dark:text-white'}>
                                    There are no items in the collection
                                </div>
                            ) : null}
                            <NftsGrid
                                isSuccess={collectionItemsFetched}
                                isError={combinedError}
                                isLoading={combinedLoading}
                                items={collectionItems}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="relative">
                            {combinedError && !combinedLoading && (
                                <div className="text-center text-red-400">
                                    Failed to fetch collections, click{' '}
                                    <span
                                        onClick={refetchCollections}
                                        className="text-accent hover:underline cursor-pointer"
                                    >
                                        here
                                    </span>{' '}
                                    to try again
                                </div>
                            )}
                            {!combinedError && !combinedLoading && ownerCollectionItems.length === 0 ? (
                                <div className={'text-center dark:text-white'}>
                                    User doesn't own any of the items in the collection
                                </div>
                            ) : null}
                            <NftsGrid
                                isSuccess={collectionItemsFetched}
                                isError={combinedError}
                                isLoading={combinedLoading}
                                items={ownerCollectionItems}
                            />
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </>
    );
};
