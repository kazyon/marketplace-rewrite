import Hero from '@/sections/home/components/Hero';
import NewsLetter from '@/sections/home/components/NewsLetter';
import React from 'react';
import { CryptoChart } from '@/sections/home/components/CryptoChart';
import { HomeSlider } from '@/sections/home/components/HomeSlider';

export const HomeSection = () => {
    return (
        <>
            <Hero />
            <div className="text-center my-4 mb-24 flex flex-wrap items-center  justify-center gap-4">
                <a
                    href="https://artechfusion.gallery/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-4 text-lg lg:text-2xl border rounded-lg dark:text-accent hover:bg-accent dark:hover:text-white"
                >
                    Visit Our Gallery
                </a>
                <a
                    href="https://icoholder.com/en/a-nft-world-1071376"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-4 text-lg lg:text-2xl border rounded-lg dark:text-accent hover:bg-accent dark:hover:text-white"
                >
                    ICO Holder Profile
                </a>
            </div>
            <HomeSlider />
            {/* <CryptoChart /> */}
            <NewsLetter />
        </>
    );
};
