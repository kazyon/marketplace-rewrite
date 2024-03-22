import Link from 'next/link';
import React, { memo, useMemo } from 'react';
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';
import { useQuery } from 'react-query';
import { getAllNfts, NftWithCollectionStatus } from '@/requests/queries/getAllNfts';
import { WithInjectedNftMetadata } from '@/shared/components/inject-metadata-hoc/WithInjectedNftMetadata';
import Skeleton from 'tiny-skeleton-loader-react';
import { CollectionSkeletonItem } from '@/sections/user/ components/CollectionSkeletonItem';
import { combineNftsInfo } from '@/sections/user/ components/UserItemsTabs';

interface CollectionsGridProps {
    collections?: ReturnType<typeof combineNftsInfo>;
    allNfts?: ReturnType<typeof combineNftsInfo>;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}
const CollectionsGrid = memo(({ collections, isLoading, allNfts, isSuccess, isError }: CollectionsGridProps) => {
    return (
        <>
            {isLoading
                ? Array.from({ length: 8 }, (_, index) => {
                      return <CollectionSkeletonItem key={index} />;
                  })
                : null}
            {isSuccess &&
                !isLoading &&
                collections &&
                collections.map((collection: NftWithCollectionStatus) => {
                    const id = collection.id;
                    const title = collection?.content?.metadata.name;

                    const collectionItems = allNfts ? allNfts.filter((nft) => nft.collectionId === collection.id) : [];

                    return (
                        <article key={id}>
                            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                                <Link href={`/collection/${id}`} className="flex space-x-[0.625rem]">
                                    <InView triggerOnce={true}>
                                        {({ inView, ref }) => {
                                            return (
                                                <span
                                                    ref={ref}
                                                    className={classNames(`w-[74.5%] h-[242px]`, {
                                                        'w-full': collectionItems.length === 0,
                                                    })}
                                                >
                                                    {inView ? (
                                                        <WithInjectedNftMetadata
                                                            metadataUri={collection?.content?.json_uri}
                                                            loadingComponent={
                                                                <Skeleton background="#676767" height={230} />
                                                            }
                                                        >
                                                            {(metadata: any) => (
                                                                <img
                                                                    height={242}
                                                                    src={metadata.image}
                                                                    alt="item 1"
                                                                    className="h-full w-full rounded-[0.625rem] object-cover"
                                                                />
                                                            )}
                                                        </WithInjectedNftMetadata>
                                                    ) : null}
                                                </span>
                                            );
                                        }}
                                    </InView>
                                    {!isSuccess &&
                                        Array.from({ length: 3 }, (_, index) => {
                                            return <Skeleton key={index} background="#676767" width={68} height={74} />;
                                        })}
                                    {!!collectionItems.length && (
                                        <span className="flex w-1/3 flex-col space-y-[0.625rem]">
                                            {collectionItems.slice(0, 3).map((nftItem) => {
                                                return (
                                                    <InView key={nftItem.id} triggerOnce={true}>
                                                        {({ inView, ref }) => {
                                                            return (
                                                                <span ref={ref}>
                                                                    {inView ? (
                                                                        <WithInjectedNftMetadata
                                                                            metadataUri={collection?.content?.json_uri}
                                                                            loadingComponent={
                                                                                <Skeleton
                                                                                    background="#676767"
                                                                                    height={64}
                                                                                />
                                                                            }
                                                                        >
                                                                            {(metadata: any) => (
                                                                                <img
                                                                                    width={68}
                                                                                    height={74}
                                                                                    src={metadata.image}
                                                                                    alt="item 1"
                                                                                    className="h-[74px] w-full rounded-[0.625rem] object-cover"
                                                                                />
                                                                            )}
                                                                        </WithInjectedNftMetadata>
                                                                    ) : null}
                                                                </span>
                                                            );
                                                        }}
                                                    </InView>
                                                );
                                            })}
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    href={`/collection/${id}`}
                                    className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white"
                                >
                                    {title}
                                </Link>
                                <span className="dark:text-jacarta-300 text-sm">{collectionItems.length} Items</span>
                            </div>
                        </article>
                    );
                })}
        </>
    );
});

export default CollectionsGrid;
