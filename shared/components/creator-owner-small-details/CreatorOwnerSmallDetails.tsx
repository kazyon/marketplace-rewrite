import { WithInjectedUsername } from '@/shared/components/inject-username-hoc/WithInjectedUsername';
import Skeleton from 'tiny-skeleton-loader-react';
import { WithInjectedFirebaseImage } from '@/shared/components/inject-firebse-image-hoc/WithInjectedFirebaseImage';
import Link from 'next/link';
import { AssetPubkeyDropdown } from '@/shared/components/creator-owner-small-details/AssetPubkeyDropdown';
import Tippy from '@tippyjs/react';
import { CheckmarkIcon } from '@/shared/components/svgs/CheckmarkIcon';
import React from 'react';
import type { DAS } from 'helius-sdk';

type CreatorOwnerSmallDetails = {
    creatorInfo: DAS.Creators;
    collectionInfoSuccess: boolean;
    ownerAddress: string;
    title: React.ReactElement | string;
    hideVerification?: boolean;
};
export function CreatorOwnerSmallDetails({
    creatorInfo,
    ownerAddress,
    collectionInfoSuccess,
    title,
    hideVerification = false,
}: CreatorOwnerSmallDetails) {
    return (
        <WithInjectedUsername pubkey={ownerAddress}>
            {(user, isLoading, isError, isSuccess) => {
                console.log({ user, ownerAddress });
                return (
                    <div className="flex">
                        <figure className="mr-4 shrink-0 relative">
                            {isLoading && <Skeleton width={48} height={48} background="#676767" />}
                            {!isLoading && (
                                <WithInjectedFirebaseImage
                                    path={`images/profile/${user?.uid}`}
                                    isActive={user?.uid}
                                    defaultUrl={'/images/avatars/profile_placeholder.png'}
                                    loadingElement={
                                        <>
                                            <Skeleton width={48} height={48} background="#676767" />
                                        </>
                                    }
                                    fetchErrorElement={<>error loading</>}
                                >
                                    {({ imageUrl }) => {
                                        return (
                                            <>
                                                <img
                                                    width={48}
                                                    height={48}
                                                    src={imageUrl}
                                                    className="rounded-2lg h-10 w-10"
                                                    loading="lazy"
                                                />
                                            </>
                                        );
                                    }}
                                </WithInjectedFirebaseImage>
                            )}
                        </figure>

                        <div>
                            <div className="text-jacarta-400 text-sm dark:text-white text-left items-center justify-center">
                                {collectionInfoSuccess && !isLoading ? (
                                    <>{title}</>
                                ) : (
                                    <Skeleton width={150} background="#676767" />
                                )}
                            </div>

                            <div className="flex">
                                {isLoading && (
                                    <Skeleton
                                        width={250}
                                        background="#676767"
                                        style={{
                                            marginTop: '0.5rem',
                                        }}
                                    />
                                )}
                                {!!user?.username && !isLoading && (
                                    <Link href={`/user/${user?.username}`} className="text-accent block">
                                        <div>{user.username}</div>
                                    </Link>
                                )}
                                {!user?.username && !isLoading && (
                                    <div className="text-accent block">
                                        <div>
                                            {ownerAddress.slice(0, 20)}...{' '}
                                            <AssetPubkeyDropdown mintAddress={ownerAddress} />
                                        </div>
                                    </div>
                                )}

                                {!isLoading && !hideVerification && (
                                    <div className="dark:border-jacarta-600 bg-green flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ml-1">
                                        {!!creatorInfo?.verified && (
                                            <Tippy
                                                content={
                                                    <span className="m-2 inline-block">
                                                        Blockchain verified creator
                                                    </span>
                                                }
                                            >
                                                <div>
                                                    <CheckmarkIcon className="icon h-[.875rem] w-[.875rem] fill-white" />
                                                </div>
                                            </Tippy>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }}
        </WithInjectedUsername>
    );
}
