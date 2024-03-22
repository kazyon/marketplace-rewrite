import React, { PropsWithChildren, useEffect } from 'react';
import { createContext, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';

export const MetaplexContext = createContext<{ metaplex: Metaplex | null }>({ metaplex: null });

const MetaplexProvider = ({ children }: PropsWithChildren) => {
    const { connection } = useConnection();
    const [metaplex, setMetaplex] = useState<Metaplex | null>(null);

    window.metaplex = metaplex;

    const wallet = useWallet();

    useEffect(() => {
        const connect = async () => {
            if (wallet && wallet?.publicKey?.toString() && !wallet.connected) {
                await wallet.connect();
            }
            const metaplex = Metaplex.make(connection);
            metaplex.use(walletAdapterIdentity(wallet));
            setMetaplex(metaplex);
        };

        if (wallet && wallet.connected && wallet?.publicKey?.toString()) {
            connect();
        }
    }, [wallet, wallet.connected, wallet?.publicKey?.toString()]);

    return <MetaplexContext.Provider value={{ metaplex }}>{children}</MetaplexContext.Provider>;
};

export { MetaplexProvider };
