import React from 'react';
import Meta from '@/shared/components/meta/Meta';
import { HelpSection } from '@/sections/help/HelpSection';

const Help_center = () => {
    return (
        <div>
            <Meta title="A-NFT.World" />
            <div className="relative pt-[5.5rem] lg:pt-24">
                <HelpSection />
            </div>
        </div>
    );
};

export default Help_center;
