import React, { memo, useRef } from 'react';
import { InView } from 'react-intersection-observer';
import { WithInjectedNftMetadata } from '@/shared/components/inject-metadata-hoc/WithInjectedNftMetadata';
import Link from 'next/link';
import { NftSkeletonItem } from '@/shared/components/nfts-grid/NftSkeletonItem';
import { DAS } from 'helius-sdk';
import { AhListedItem } from '@/requests/validation_schemas';
import solanaIconPng from '@/public/images/solana-sol-logo.png';
import Image from 'next/image';

type NftItemWithCombinedData = DAS.GetAssetResponse & {
    isCollection?: boolean;
    isAhItem?: boolean;
    ahListing?: AhListedItem;
};
interface NftGridProps {
    items?: NftItemWithCombinedData[];
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    rootClassName?: string;
}

const NftsGrid = memo(
    ({
        items,
        isLoading,
        isError,
        rootClassName = 'grid grid-cols-1 gap-[1.175rem] md:grid-cols-2 lg:grid-cols-4',
    }: NftGridProps) => {
        console.log({ isLoading });
        const itemsRootRef = useRef(null);
        return (
            <div className={rootClassName} ref={itemsRootRef}>
                {isLoading
                    ? Array.from({ length: 12 }, (_, index) => {
                          return (
                              <div
                                  className="rouned-2xl h-full dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg"
                                  key={index}
                              >
                                  <NftSkeletonItem withText />
                              </div>
                          );
                      })
                    : null}
                {!isLoading && items?.length === 0 && (
                    <div className="text-center my-12 dark:text-white w-full col-span-2 text-xl">No items found</div>
                )}
                {!isLoading &&
                    !isError &&
                    items &&
                    items.map((nftItem) => {
                        return (
                            <article key={nftItem.id}>
                                <div className="h-full dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg rounded-2xl">
                                    <figure className="relative">
                                        <InView triggerOnce={true}>
                                            {({ inView, ref }) => {
                                                return (
                                                    <div ref={ref}>
                                                        {inView ? (
                                                            <WithInjectedNftMetadata
                                                                ref={itemsRootRef}
                                                                metadataUri={nftItem?.content?.json_uri}
                                                                loadingComponent={<NftSkeletonItem />}
                                                            >
                                                                {(metadata) => {
                                                                    return (
                                                                        <Link href={`/item/${nftItem.id || ''}`}>
                                                                            <img
                                                                                width={230}
                                                                                height={230}
                                                                                src={metadata?.image}
                                                                                alt={`Nft name: ${metadata?.name}, Description: ${metadata?.description}`}
                                                                                className="w-full h-[230px] rounded-[0.625rem] object-cover"
                                                                            />
                                                                        </Link>
                                                                    );
                                                                }}
                                                            </WithInjectedNftMetadata>
                                                        ) : null}
                                                    </div>
                                                );
                                            }}
                                        </InView>
                                    </figure>
                                    <div className="mt-7 flex items-center justify-between">
                                        <Link href={`/item/${nftItem.id || ''}`}>
                                            <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                                                {nftItem?.content?.metadata.name}
                                            </span>
                                        </Link>
                                        {nftItem.ahListing ? (
                                            <div className="flex items-center">
                                                <span className="dark:text-white">
                                                    {nftItem.ahListing.price / Math.pow(10, 9)}
                                                </span>
                                                <Image
                                                    src={solanaIconPng.src}
                                                    width={13}
                                                    height={13}
                                                    className={'mx-1'}
                                                    alt={'Solana icon'}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
            </div>
        );
    }
);

export default NftsGrid;
