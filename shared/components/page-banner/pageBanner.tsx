import React from 'react';
import Image from 'next/image';
import { SearchIcon } from '@/shared/components/svgs/SearchIcon';
import bannerImg from '@/public/images/banner-contact-us.png';

interface ImageTitleProps {
    text: string;
    input?: boolean;
}
export const PageBanner = ({ text, input = false }: ImageTitleProps) => {
    return (
        <div>
            <section className="after:bg-jacarta-900/60 relative bg-cover bg-center bg-no-repeat py-32 after:absolute after:inset-0">
                <Image
                    width={700}
                    height={400}
                    src={bannerImg}
                    alt="gradient"
                    sizes={'100vw'}
                    className="h-full w-full object-cover absolute inset-0"
                />
                <div className="container relative z-10">
                    <h1 className="font-display text-center text-4xl font-medium text-white">{text}</h1>

                    {input && (
                        <form action="search" className="relative mx-auto block max-w-md mt-4">
                            <input
                                type="search"
                                className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 pl-10 bg-white"
                                placeholder="Search"
                            />
                            <span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
                                <SearchIcon className="fill-jacarta-500 h-4 w-4" />
                            </span>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};
