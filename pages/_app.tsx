import '../styles/globals.css';
// import { ThemeProvider } from 'next-themes';
import Layout from '../sections/root/layout';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import React from 'react';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TrustWalletAdapter,
    CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { MetaplexProvider } from '@/shared/context/MetaplexContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@solana/wallet-adapter-react-ui/styles.css';
import Meta from '@/shared/components/meta/Meta';
import FirebaseAuthProvider from '@/shared/context/FirebaseAuthContext';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps) {
    const { current: queryClient } = useRef(
        new QueryClient({
            defaultOptions: { queries: { staleTime: 0, refetchOnWindowFocus: false } },
        })
    );
    const router = useRouter();

    const pid = router.asPath;

    // const network = WalletAdapterNetwork.Mainnet;
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    // // const endpoint = 'https://api.mainnet-beta.solana.com';

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new TrustWalletAdapter(),
            new SolflareWalletAdapter(),
            new CoinbaseWalletAdapter(),
        ],
        []
    );

    return (
        <>
            <Meta title="A-Nft World" />

            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: 'text-l',
                }}
            />
            <div className={'dark'}>
                {/*<ThemeProvider attribute="class">*/}
                {/*TODO: remove api key and change to use env variables*/}
                <ConnectionProvider
                    endpoint={'https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}'} // this will hinder the initial connection of the wallet, needs to be replaced by a real API key
                >
                    <WalletProvider wallets={wallets} autoConnect={true}>
                        <WalletModalProvider>
                            <FirebaseAuthProvider>
                                <MetaplexProvider>
                                    <QueryClientProvider client={queryClient}>
                                        {pid === '/login' ? (
                                            <Component key={pid} {...pageProps} />
                                        ) : (
                                            <Layout>
                                                <Component key={pid} {...pageProps} />
                                            </Layout>
                                        )}
                                    </QueryClientProvider>
                                </MetaplexProvider>
                            </FirebaseAuthProvider>
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
                {/*</ThemeProvider>*/}
            </div>
        </>
    );
}

export default MyApp;
