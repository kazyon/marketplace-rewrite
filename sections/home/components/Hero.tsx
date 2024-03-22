import React from 'react';
import Image from 'next/image';

const Hero = () => {
    return (
        <>
            <section className="hero relative py-20 md:pt-32">
                <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 dark:hidden">
                    <Image
                        width={1519}
                        height={773}
                        priority
                        src="/images/gradient.jpg"
                        alt="gradient"
                        className="h-full w-full object-cover"
                    />
                </picture>
                <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden dark:block">
                    <Image
                        width={1519}
                        height={773}
                        priority
                        className="h-full w-full"
                        src="/images/gradient_dark.jpg"
                        alt="gradient dark"
                    />
                </picture>

                <div className="container">
                    <div className="mx-auto max-w-2xl pt-24 text-center">
                        <h1 className="mb-10 font-display text-5xl text-jacarta-700 dark:text-white lg:text-6xl xl:text-7xl">
                            Discover, Collect & Sell
                            <span className="animate-gradient"> Creative NFTs</span>
                        </h1>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;
