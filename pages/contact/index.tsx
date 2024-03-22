import React from 'react';
import Meta from '@/shared/components/meta/Meta';
import { ContactSection } from '@/sections/contact/ContactSection';

const Contact = () => {
    return (
        <div>
            <Meta title="A-NFT.World" />
            <div className="pt-[5.5rem] lg:pt-24">
                <ContactSection />
            </div>
        </div>
    );
};

export default Contact;
