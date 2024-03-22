import { WithInjectedFirebaseImage } from '@/shared/components/inject-firebse-image-hoc/WithInjectedFirebaseImage';
import Skeleton from 'tiny-skeleton-loader-react';
import { BiSolidErrorCircle } from 'react-icons/bi';
import profilePlaceholderImg from '@/public/images/avatars/profile_placeholder.png';
import Tippy from '@tippyjs/react';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatDate } from '@/utils/dates';
import SocialShare from '@/shared/components/social-share/SocialShare';
import UserItemsTabs from '@/sections/user/ components/UserItemsTabs';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getUserPublicInfo } from '@/requests/queries/getUserPublicInfo';
import toast from 'react-hot-toast';
import { CloseIcon } from '@/shared/components/svgs/CloseIcon';

export const UserSection = () => {
    const router = useRouter();

    const username = typeof router.query.username === 'string' ? router.query.username : null;

    const {
        data: userPublicInfo,
        isSuccess: userInfoSuccess,
        isError: userInfoError,
        refetch: refetchUserProfile,
        isFetching: userInfoLoading,
    } = useQuery({
        queryKey: ['user-public-info', username],
        queryFn: () => getUserPublicInfo({ username: username as string }),
        staleTime: 0,
        enabled: !!username,
        onError: () => {
            const toastId = toast.error(
                <div className="flex flex-wrap">
                    <div>Failed to get user's info</div>

                    <div
                        className={'ml-auto cursor-pointer hover:bg-accent transition-colors'}
                        onClick={() => toast.dismiss(toastId)}
                    >
                        <CloseIcon />
                    </div>
                    <div>
                        Click{' '}
                        <span
                            onClick={() => refetchUserProfile()}
                            className="text-accent hover:underline cursor-pointer"
                        >
                            here
                        </span>{' '}
                        to try again
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

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setCopied(false);
        }, 4000);
    }, [copied]);

    return (
        <>
            <div className="relative h-[18.75rem]">
                {userInfoSuccess ? (
                    <WithInjectedFirebaseImage
                        path={`images/cover/${userPublicInfo.uid}`}
                        isActive={!!userPublicInfo?.uid}
                        defaultUrl={'/images/avatars/profile_placeholder.png'}
                        loadingElement={<Skeleton height={300} background="#676767" />}
                        fetchErrorElement={
                            <div
                                className={
                                    'w-full h-full flex items-center justify-center text-center text-red-300 flex-col'
                                }
                            >
                                <div>
                                    <BiSolidErrorCircle className={'text-2xl mb-2'} />
                                </div>
                                Cover image request failure
                            </div>
                        }
                    >
                        {({ imageUrl, isFinal, isSuccess }) => {
                            return (
                                <>
                                    {isFinal && isSuccess ? (
                                        <img
                                            width={1519}
                                            height={300}
                                            src={imageUrl}
                                            alt="banner"
                                            className="h-[18.75rem] w-full object-cover"
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </>
                            );
                        }}
                    </WithInjectedFirebaseImage>
                ) : null}
            </div>
            <section className="dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28">
                <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <figure className="relative h-40 dark:border-jacarta-600 rounded-xl overflow-hidden">
                        {!userInfoError ? (
                            <WithInjectedFirebaseImage
                                path={`images/profile/${userPublicInfo?.uid}`}
                                isActive={!!userPublicInfo?.uid}
                                loading={userInfoLoading && !userInfoError && !userInfoSuccess}
                                defaultUrl={profilePlaceholderImg.src}
                                loadingElement={
                                    <Skeleton
                                        width={141}
                                        style={{
                                            height: '10rem',
                                        }}
                                        background="#676767"
                                    />
                                }
                                fetchErrorElement={
                                    <div
                                        className={
                                            'w-[141px] h-full bg-gray-600 flex items-center justify-center text-center text-red-300 flex-col'
                                        }
                                    >
                                        <div>
                                            <BiSolidErrorCircle className={'text-2xl mb-2'} />
                                        </div>
                                        Profile image request failure
                                    </div>
                                }
                            >
                                {({ imageUrl }) => {
                                    return (
                                        <>
                                            <img
                                                height={141}
                                                src={imageUrl}
                                                className="rounded-xl w-full h-40 object-contain drop-shadow-md"
                                            />
                                        </>
                                    );
                                }}
                            </WithInjectedFirebaseImage>
                        ) : null}
                    </figure>
                </div>

                <div className="container">
                    {userInfoSuccess || userInfoLoading ? (
                        <div className="text-center">
                            <h2 className="font-display text-jacarta-700 mb-2 text-4xl font-medium dark:text-white text-center">
                                {userPublicInfo ? (
                                    <>{username}</>
                                ) : (
                                    <Skeleton
                                        style={{
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                        width={300}
                                        background="#676767"
                                    />
                                )}
                            </h2>
                            <div className="dark:bg-jacarta-700 gap-4 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex items-center justify-center rounded-full border bg-white py-1.5 px-4">
                                {userPublicInfo ? (
                                    <>
                                        <Tippy content={<span className="m-2 inline-block">SOL</span>}>
                                            <>
                                                <Image
                                                    width={13}
                                                    height={13}
                                                    src={'/images/solana-sol-logo.png'}
                                                    alt={'Solana icon'}
                                                />
                                            </>
                                        </Tippy>

                                        <Tippy
                                            hideOnClick={false}
                                            content={
                                                copied ? (
                                                    <span className="m-2 inline-block">copied</span>
                                                ) : (
                                                    <span className="m-2 inline-block">copy</span>
                                                )
                                            }
                                        >
                                            <button className="js-copy-clipboard dark:text-jacarta-200 max-w-[10rem] select-none overflow-hidden text-ellipsis whitespace-nowrap">
                                                <CopyToClipboard
                                                    text={userPublicInfo?.pubkey}
                                                    onCopy={() => setCopied(true)}
                                                >
                                                    <span>{userPublicInfo?.pubkey}</span>
                                                </CopyToClipboard>
                                            </button>
                                        </Tippy>
                                    </>
                                ) : (
                                    <Skeleton
                                        background="#676767"
                                        width={300}
                                        style={{
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                    />
                                )}
                            </div>

                            <p className="dark:text-jacarta-300 mx-auto mb-2 max-w-xl text-lg">
                                {userPublicInfo ? (
                                    userPublicInfo.bio
                                ) : (
                                    <Skeleton
                                        background="#676767"
                                        width={300}
                                        style={{
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                    />
                                )}
                            </p>
                            <span className="text-jacarta-400">
                                {userPublicInfo && userPublicInfo?.createdAt ? (
                                    <>Joined {formatDate(userPublicInfo.createdAt)}</>
                                ) : (
                                    <Skeleton
                                        background="#676767"
                                        width={300}
                                        style={{
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                    />
                                )}
                            </span>

                            <div className="mt-6 flex items-center justify-center space-x-2.5 relative">
                                {userInfoSuccess ? <SocialShare /> : null}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
            <UserItemsTabs />
        </>
    );
};
