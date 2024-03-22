import React from 'react';
import 'tippy.js/dist/tippy.css';
import Meta from '@/shared/components/meta/Meta';
import { ItemSection } from '@/sections/item/ItemSection';
import { WrongPubkeyModal } from '@/sections/root/WrongPubkeyModal';

const Address = () => {
    return (
        <>
            <Meta title="A-NFT.World" />
            <ItemSection />
            <WrongPubkeyModal />
        </>
    );
};

export default Address;
