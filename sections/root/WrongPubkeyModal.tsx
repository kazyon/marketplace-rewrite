import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { useQuery } from 'react-query';
import { getUser } from '@/requests/queries/getUser';
import { User } from 'firebase/auth';
import WalletMultiButton from '@/shared/components/wallet-multi-button/WalletMultiButton';
import classNames from 'classnames';

type WrongPubkeyModalProsp = {
    className?: string;
};
export function WrongPubkeyModal({ className = '' }: WrongPubkeyModalProsp) {
    const wallet = useWallet();

    const user = useFirebaseAuth();

    const { data: userData } = useQuery({
        queryKey: ['userData', user],
        queryFn: () => getUser((user as User).uid),
        staleTime: 1000 * 60 * 30,
        enabled: !!user?.uid,
    });

    console.log(wallet?.publicKey?.toString());

    const walletPubkey = wallet?.publicKey?.toString();
    const samePubkey = wallet?.publicKey?.toString() === userData?.pubkey;
    //
    // useEffect(() => {
    //     if (userData?.pubkey) {
    //         window?.phantom?.solana.on('connect', async (pubkey) => {
    //             setPhantomKey(pubkey.toString());
    //         });
    //     }
    //
    //     return () => {
    //         window?.phantom?.solana.off('connect');
    //     };
    // }, [wallet?.publicKey?.toString(), userData?.pubkey]);

    // useEffect(() => {
    //     if (userData && !samePubkey && wallet?.connected) {
    //         wallet?.disconnect();
    //     }
    // }, [wallet?.connected, userData, samePubkey, wallet?.publicKey?.toString()]);
    //
    // useEffect(() => {
    //     if (phantomKey && userData && phantomKey !== userData?.pubkey) {
    //         wallet.disconnect();
    //     }
    // }, [phantomKey, userData?.pubkey]);
    //
    // useEffect(() => {
    //     window.wallet = wallet;
    // }, [wallet]);

    return (
        <>
            {userData && wallet && !samePubkey ? (
                <div
                    className={classNames(
                        'dark:text-white fixed inset-0 bg-black bg-opacity-90 z-20 flex items-center justify-center text-lg',
                        className
                    )}
                >
                    <div>
                        <div className={'flex flex-col gap-4 mb-4 text-center'}>
                            <div>
                                <div>Current wallet address:</div>
                                <span className={'text-accent overflow-hidden text-ellipsis'}>{walletPubkey}</span>
                            </div>
                            <div>
                                <div>User address</div>
                                <span className={'text-accent overflow-hidden text-ellipsis'}>{userData?.pubkey}</span>
                            </div>
                        </div>
                        {/*<div className="dark:text-white mb-4 flex flex-col gap-2 leading-[24px] text-center max-w-[80vw]">*/}
                        {/*    Please connect the wallet with the address:*/}
                        {/*    <span className={'text-accent overflow-hidden text-ellipsis'}>{userData?.pubkey}</span>*/}
                        {/*    in order to continue*/}
                        {/*</div>*/}
                        <WalletMultiButton />
                    </div>
                </div>
            ) : null}
        </>
    );
}
