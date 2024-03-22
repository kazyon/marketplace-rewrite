import React from 'react';
import Meta from '@/shared/components/meta/Meta';
import 'tippy.js/themes/light.css';
import { CollectionSection } from '@/sections/collection/CollectionSection';

const Collection = () => {
    return (
        <>
            <Meta title="A-NFT.World" />

            <div className="pt-[5.5rem] lg:pt-24">
                <CollectionSection />
            </div>
        </>
    );
};

export default Collection;
