import React from 'react';
import Meta from '@/shared/components/meta/Meta';
import { AuctionSection } from '@/sections/marketplace/AuctionSection';

const Auction = () => {
    return (
        <>
            <Meta title="A-NFT.World" />

            <main className="mt-24">
                <AuctionSection />
            </main>
        </>
    );
};

export default Auction;
