import React from 'react';
import Image from 'next/image';
import { Heading } from '@/shared/components/heading/Heading';
import { newseLatterData } from '@/sections/home/config';

const NewsLetter = () => {
    return (
        <section className="dark:bg-jacarta-800 relative py-24">
            <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
                <Image
                    src="/images/gradient_light.jpg"
                    alt="gradient"
                    className="h-full w-full object-cover"
                    width={1559}
                    height={761}
                />
            </picture>

            <div className="container">
                <Heading
                    text="Create and sell your NFTs"
                    classes="font-display text-jacarta-700 mb-16 text-center text-3xl dark:text-white"
                />

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {newseLatterData.map((item) => {
                        const { id, icon, title, text } = item;
                        return (
                            <div className="text-center newseLatter-item" key={id}>
                                <div
                                    className={`mb-6 inline-flex rounded-full p-3`}
                                    style={{ backgroundColor: icon.parentBg }}
                                >
                                    <div
                                        className={`inline-flex h-12 w-12 items-center justify-center rounded-full`}
                                        style={{
                                            backgroundColor: icon.childBg,
                                        }}
                                    >
                                        {icon.svg}
                                    </div>
                                </div>
                                <h3 className="font-display text-jacarta-700 mb-4 text-lg dark:text-white">
                                    {id}. {title}
                                </h3>
                                <p className="dark:text-jacarta-300">{text}</p>
                            </div>
                        );
                    })}
                </div>

                <p className="text-jacarta-700 mx-auto mt-20 max-w-2xl text-center text-lg dark:text-white">
                    Join our whitelisting and to stay in the loop with our newest feature releases, NFT drops, and tips
                    and tricks for navigating A-NFT.World
                </p>

                <div className="mx-auto mt-7 max-w-md text-center">
                    <form className="relative" onSubmit={(e) => e.preventDefault()}>
                        <button className="hover:bg-accent-dark font-display bg-accent content-center top-2 right-2 rounded-full px-6 py-4 text-sm text-white">
                            <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=zG8U6vUZs0ajGCV4dOtk5BGCCLdpPIJHsU3ROtLCro9UQ0tBWDI3UFc3NDlHQ0xHQktZVFRMQ0YzVy4u">
                                Join our whitelisting
                            </a>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default NewsLetter;
