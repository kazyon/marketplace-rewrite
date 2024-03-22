import React from 'react';
import Head from 'next/head';

interface MetaProps {
    title?: string;
    keyword?: string;
    desc?: string;
}
const Meta = ({
    title = 'A-NFT | NFT Marketplace',
    keyword = 'solana, blockchain, crypto, crypto collectibles, crypto makretplace, cryptocurrency, digital items, market, nft, nft marketplace, nft next js, NFT react, non-fungible tokens, virtual asset, wallet',
    desc = '',
}: MetaProps) => {
    // https://github.com/vercel/next.js/discussions/38256#discussioncomment-3070196
    // ⬇ change the title only in the const below ⬇
    const titleString = `${title} | A-NFT`;
    return (
        <div>
            <Head>
                <title>{titleString}</title>
                <link rel="icon" href="/favicon.png" />
                <meta name="description" content={desc} />
                <meta name="keyword" content={keyword} />
            </Head>
        </div>
    );
};

export default Meta;
