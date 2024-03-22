import React from 'react';
import 'tippy.js/dist/tippy.css'; // optional
import 'react-tabs/style/react-tabs.css';
import Meta from '@/shared/components/meta/Meta';
import { CreateSection } from '@/sections/create/CreateSection';
import { WrongPubkeyModal } from '@/sections/root/WrongPubkeyModal';

const Create = () => {
    return (
        <div>
            <Meta title="A-NFT.World" />
            <section className="relative py-24 pt-40">
                <CreateSection />
                <WrongPubkeyModal />
            </section>
        </div>
    );
};

export default Create;
