import React from 'react';
import Meta from '@/shared/components/meta/Meta';
import { AboutSection } from '@/sections/about/AboutSection';

const About = () => {
    return (
        <>
            <Meta title="A-NFT.World" />
            <section className="py-24 pt-40">
                <AboutSection />
            </section>
        </>
    );
};

export default About;
