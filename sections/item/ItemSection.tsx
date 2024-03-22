import { WithInjectedNftMetadata } from '@/shared/components/inject-metadata-hoc/WithInjectedNftMetadata';
import Image from 'next/image';
import { ContentViewer } from '@/sections/item/components/ContentViewer';
import Skeleton from 'tiny-skeleton-loader-react';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import { CheckmarkIcon } from '@/shared/components/svgs/CheckmarkIcon';
import { CreatorOwnerSmallDetails } from '@/shared/components/creator-owner-small-details/CreatorOwnerSmallDetails';
import { AuctionHouseActionsSection } from '@/sections/item/components/AuctionHouseActionsSection';
import { Heading } from '@/shared/components/heading/Heading';
import React from 'react';
import { useMetaplex } from '@/shared/hooks/useMetaplex';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { fetchNftInfo } from '@/requests/queries/fetchNftInfo';
import toast from 'react-hot-toast';
import { CloseIcon } from '@/shared/components/svgs/CloseIcon';
import { getCollectionsItems } from '@/requests/queries/getCollectionsItems';
import { NftsCarousel } from '@/sections/item/components/BidsCarousel';
import { ItemsTabs } from '@/sections/item/components/ItemTabs';

export const ItemSection = () => {
    const { metaplex } = useMetaplex();

    const userWalletAddress = metaplex?.identity().publicKey.toString();

    const router = useRouter();

    const address = typeof router.query.address === 'string' ? router.query.address : null;

    const {
        data: nftInfo,
        isFetching: nftInfoLoading,
        isError: nftInfoError,
        isRefetchError: nftInfoRefetchError,
        isSuccess: nftInfoSuccess,
        refetch: refetchNftInfo,
    } = useQuery({
        queryKey: ['nft-item', address],
        queryFn: () => fetchNftInfo(address),
        staleTime: 0,
        enabled: Boolean(address),
        onError: () => {
            let toastId: undefined | string;
            toastId = toast.error(
                <div>
                    <div>Failed to load nft info</div>
                    <div>
                        Click{' '}
                        <span onClick={() => refetchNftInfo()} className="text-accent hover:underline cursor-pointer">
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

    const owner = nftInfo?.ownership?.owner;

    const parentCollectionAddress = nftInfo?.grouping?.find((group) => group.group_key === 'collection')?.group_value;

    const {
        data: collectionItem,
        isFetching: collectionItemLoading,
        isLoadingError: collectionItemError,
        isSuccess: collectionItemSuccess,
        refetch: collectionItemRefetch,
    } = useQuery({
        queryKey: ['collection-item', parentCollectionAddress],
        queryFn: () => fetchNftInfo(parentCollectionAddress),
        staleTime: 0,
        enabled: Boolean(parentCollectionAddress),
        onError: () => {
            let toastId: undefined | string;
            toastId = toast.error(
                <div>
                    <div>Failed to collection item info</div>
                    <div>
                        Click{' '}
                        <span
                            onClick={() => collectionItemRefetch()}
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
            console.log({ toastId });
        },
    });

    const {
        data: collectionList,
        isFetching: collectionListLoading,
        isLoadingError: collectionListError,
        isSuccess: collectionListSuccess,
        refetch: collectionListRefetch,
    } = useQuery({
        queryKey: ['collection-list', address],
        queryFn: () => getCollectionsItems(collectionItem?.id),
        staleTime: 0,
        enabled: Boolean(collectionItem?.id),
        onError: () => {
            let toastId: undefined | string;
            toastId = toast.error(
                <div>
                    <div>Failed to collection items</div>
                    <div>
                        Click{' '}
                        <span
                            onClick={() => collectionListRefetch()}
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
            console.log({ toastId });
        },
    });

    const shouldShowCollectionList =
        !collectionListLoading && !collectionListError && collectionListSuccess && collectionList?.items.length > 1;

    return (
        <>
            {collectionItemError && (
                <div className="relative lg:mt-24 lg:pt-24 lg:pb-24 pt-12 pb-24 text-center text-red-400 mt-[200px]">
                    Failed to fetch collections, click{' '}
                    <span className="text-accent hover:underline cursor-pointer">here</span> to try again
                </div>
            )}

            <WithInjectedNftMetadata metadataUri={nftInfo?.content?.json_uri} withoutLoading={true}>
                {(metadata, isLoading, isError, isSuccess, refetch) => {
                    const combinedLoading = isLoading || nftInfoLoading;
                    const combinedError = isError || nftInfoError || nftInfoRefetchError;
                    const combinedSuccess = isSuccess && nftInfoSuccess;

                    const combinedCollectionLoading = isLoading || collectionItemLoading;
                    const combinedCollectionError = isError || collectionItemError;
                    const combinedCollectionSuccess = isSuccess && collectionItemSuccess;

                    const shouldShowContent = !combinedLoading && !combinedError && combinedSuccess;
                    const shouldShowCollectionContent =
                        !combinedCollectionLoading &&
                        !combinedCollectionError &&
                        combinedCollectionSuccess &&
                        collectionItem;

                    return (
                        <>
                            <section className="relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
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
                                    <div className="md:flex md:flex-wrap">
                                        <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
                                            <button className=" w-full">
                                                <div className={'w-full  rounded-2lg'}>
                                                    {shouldShowContent && <ContentViewer metadata={metadata} />}
                                                </div>
                                                {combinedLoading && (
                                                    <Skeleton background="#676767" height={400} width={400} />
                                                )}
                                            </button>
                                        </figure>
                                        <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
                                            {shouldShowContent && nftInfo && owner && nftInfo?.creators?.[0] && (
                                                <CreatorOwnerSmallDetails
                                                    creatorInfo={nftInfo.creators[0]}
                                                    collectionInfoSuccess={true}
                                                    ownerAddress={owner}
                                                    title={
                                                        <>Creator {nftInfo?.ownership?.owner === owner && '/Owner'}</>
                                                    }
                                                />
                                            )}

                                            {shouldShowContent &&
                                                nftInfo &&
                                                owner &&
                                                nftInfo?.creators?.[0] &&
                                                nftInfo?.ownership?.owner !== owner && (
                                                    <CreatorOwnerSmallDetails
                                                        creatorInfo={nftInfo.creators[0]}
                                                        collectionInfoSuccess={false}
                                                        ownerAddress={nftInfo?.ownership?.owner}
                                                        title={<>Creator {nftInfo?.id === owner && '/Owner'}</>}
                                                    />
                                                )}
                                            <h1 className="font-display text-jacarta-700 mb-4 mt-6 text-4xl font-semibold dark:text-white">
                                                {combinedLoading && <Skeleton background="#676767" width={300} />}
                                                {shouldShowContent && metadata?.name}
                                            </h1>

                                            {combinedLoading && (
                                                <p className="dark:text-jacarta-300 mb-10">
                                                    <div className="flex flex-col gap-2">
                                                        <Skeleton background="#676767" width={300} />

                                                        <Skeleton background="#676767" width={300} />
                                                    </div>
                                                </p>
                                            )}

                                            {parentCollectionAddress && combinedCollectionLoading && (
                                                <Skeleton background="#676767" width={200} />
                                            )}

                                            {shouldShowCollectionContent && (
                                                <div
                                                    className={
                                                        'mb-6 text-jacarta-400 text-sm dark:text-white flex flex-row items-center'
                                                    }
                                                >
                                                    Part of the{' '}
                                                    <Link
                                                        href={`/collection/${collectionItem?.id.toString()}`}
                                                        className="text-accent text-sm font-bold ml-2"
                                                    >
                                                        {collectionItem?.content?.metadata.name}
                                                    </Link>{' '}
                                                    {collectionItem?.creators?.[0].verified && (
                                                        <div
                                                            className="mx-2 dark:border-jacarta-600 bg-green -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                                                            data-tippy-content="Verified Collection"
                                                        >
                                                            <Tippy
                                                                content={
                                                                    <span className="m-2 inline-block">
                                                                        Verified Collection
                                                                    </span>
                                                                }
                                                            >
                                                                <div>
                                                                    <CheckmarkIcon className="icon h-[.875rem] w-[.875rem] fill-white" />
                                                                </div>
                                                            </Tippy>
                                                        </div>
                                                    )}
                                                    collection
                                                </div>
                                            )}

                                            {shouldShowContent ? (
                                                <>
                                                    <div className="dark:bg-jacarta-700 dark:text-white dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-4 mb-6">
                                                        {metadata.description}
                                                    </div>
                                                </>
                                            ) : null}

                                            <div className={'my-8'}>
                                                {nftInfo?.ownership.owner && userWalletAddress && (
                                                    <AuctionHouseActionsSection
                                                        nftInfo={nftInfo}
                                                        userWalletAddress={userWalletAddress}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container">
                                    {shouldShowContent && metadata?.attributes && metadata?.attributes.length > 0 && (
                                        <ItemsTabs attributes={metadata?.attributes} />
                                    )}
                                </div>
                            </section>
                        </>
                    );
                }}
            </WithInjectedNftMetadata>

            {shouldShowCollectionList && (
                <section className="dark:bg-jacarta-800 bg-light-base py-12">
                    <div className="container">
                        <Heading
                            text={
                                <div>
                                    More from the{' '}
                                    {collectionItem?.content?.metadata.name && (
                                        <Link
                                            href={`/collection/${collectionItem.id}`}
                                            className="text-accent font-bold"
                                        >
                                            {collectionItem?.content.metadata.name}
                                        </Link>
                                    )}{' '}
                                    collection
                                </div>
                            }
                            classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white"
                        ></Heading>

                        <div className="relative">
                            <NftsCarousel items={collectionList?.items.filter((item) => item.id !== nftInfo?.id)} />
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};
