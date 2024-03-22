import truncateWallet from '@/utils/trucateWallet';
import { CopyToClipboardIcon } from '@/shared/components/svgs/CopyToClipboardIcon';
import SolanaIcon from '@/shared/components/svgs/SolanaIcon';
import WalletMultiButton from '@/shared/components/wallet-multi-button/WalletMultiButton';
import Link from 'next/link';
import { ProfileIcon } from '@/shared/components/svgs/ProfileIcon';
import { SettingsIcon } from '@/shared/components/svgs/SettingsIcon';
import { LogoutIcon } from '@/shared/components/svgs/LogoutIcon';
import React, { useEffect, useRef, useState } from 'react';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getUser } from '@/requests/queries/getUser';
import { signOut, User } from 'firebase/auth';
import { auth } from '@/shared/firebase/config';
import { PublicKey } from '@metaplex-foundation/js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import roundBalance from '@/utils/roundBalance';

export function AccountContents() {
    const user = useFirebaseAuth();
    const wallet = useWallet();
    const router = useRouter();

    const { connection } = useConnection();

    const [balance, setBalance] = useState<number | null>(null);

    const { data: userData } = useQuery({
        queryKey: ['userData', user],
        queryFn: () => getUser((user as User).uid),
        staleTime: 0,
        enabled: !!user?.uid,
    });

    const signOutHandler = async () => {
        await signOut(auth);
        await wallet?.disconnect();
        router.replace('/login');
    };

    const getBalance = async (publicKey: PublicKey) => {
        if (wallet?.publicKey?.toString() && userData?.pubkey && wallet?.publicKey.toString() !== userData?.pubkey) {
            setBalance(null);
        }
        try {
            console.log({ connection });
            const lamportsBalance = await connection.getBalance(publicKey);
            const solBalance = lamportsBalance / LAMPORTS_PER_SOL;
            setBalance(roundBalance(solBalance));
        } catch (error) {
            console.error('Error getting balance:', error);
        }
    };

    useEffect(() => {
        if (wallet?.publicKey) {
            getBalance(wallet.publicKey);
        }
    }, [wallet?.publicKey]);

    useEffect(() => {
        const connectHandler = async (adapterPublicKey: PublicKey) => {
            // if (adapterPublicKey.toBase58() === userData?.pubkey) {
            //     try {
            //         const lamportsBalance = await connection.getBalance(adapterPublicKey);
            //         const solBalance = lamportsBalance / LAMPORTS_PER_SOL;
            //         setBalance(roundBalance(solBalance));
            //     } catch (error) {
            //         console.error('Error getting balance:', error);
            //     }
            // } else {
            //     await wallet?.adapter?.disconnect();
            // }
        };

        const disconnectHandler = () => {
            // alert('DIS');
            // setBalance(0);
        };

        // wallet?.adapter?.addListener('readyStateChange', (e) => {
        //     alert('dsas');
        //     console.log('readyStateChange', { e });
        // });
        //
        // wallet?.adapter?.addListener('connect', (e) => {
        //     alert('dsas');
        //
        //     console.log('connect', { e });
        // });
        wallet?.adapter?.addListener('connect', connectHandler);
        wallet?.adapter?.addListener('disconnect', disconnectHandler);

        return () => {
            // wallet?.adapter?.('connect', connectHandler);
            // wallet?.adapter?.off('disconnect', disconnectHandler);
        };
    }, [wallet?.adapter]);

    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        if (isCopied) {
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        }

        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [isCopied]);

    return (
        <>
            <div>
                <div className="text-white px-5 font-bold animate-gradient flex">Account address:</div>
                <button
                    onClick={async () => {
                        if (userData?.pubkey) {
                            await navigator.clipboard.writeText(userData?.pubkey);
                            setIsCopied(true);
                        }
                    }}
                    className="font-display gap-2 text-jacarta-700 my-4 mt-2 flex select-none items-center justify-center w-full whitespace-nowrap px-5 leading-none dark:text-white"
                >
                    {isCopied ? (
                        'Copied to clipboard'
                    ) : (
                        <span>{userData?.pubkey ? truncateWallet(userData?.pubkey) : null}</span>
                    )}

                    <CopyToClipboardIcon className="dark:fill-jacarta-300 fill-jacarta-500 ml-auto mb-px h-4 w-4" />
                </button>
            </div>
            {balance && wallet?.connected ? (
                <div className="dark:border-jacarta-600 border-jacarta-100 mx-5 mb-6 rounded-lg border p-4">
                    <span className="dark:text-jacarta-200 text-sm font-medium tracking-tight">Account address</span>
                    <div className="flex items-center gap-x-2">
                        <>
                            <SolanaIcon width="13" height="13" />
                        </>

                        <span className="text-green text-lg font-bold">{balance}</span>
                    </div>
                </div>
            ) : null}
            <div className="p-3">
                <WalletMultiButton className="w-full" />
            </div>

            <Link
                href={`/user/${userData?.username}`}
                className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors"
            >
                <ProfileIcon className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white" />
                <span className="font-display text-jacarta-700 text-sm dark:text-white">My Profile</span>
            </Link>
            <Link
                href="/profile/edit"
                className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors"
            >
                <SettingsIcon className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white" />
                <span className="font-display text-jacarta-700 text-sm dark:text-white">Edit Profile</span>
            </Link>
            <button
                className="w-full dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors"
                onClick={signOutHandler}
            >
                <LogoutIcon className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white" />
                <span className="font-display text-jacarta-700 text-sm dark:text-white">Sign out</span>
            </button>
        </>
    );
}
