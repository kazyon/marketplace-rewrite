import { PageBanner } from '@/shared/components/page-banner/pageBanner';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { accordion_data, help_center_data } from '@/sections/help/config';
import { HelpAccordion } from '@/sections/help/components/helpAccordion';

export const HelpSection = () => {
    return (
        <>
            <PageBanner text="How can I help you?" input={false} />
            <section className="relative py-24">
                <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
                    <Image
                        width={1519}
                        height={773}
                        priority
                        src="/images/gradient_light.jpg"
                        alt="gradient"
                        className="h-full w-full object-cover"
                    />
                </picture>
                <div className="container">
                    <h2 className="font-display text-jacarta-700 mb-10 text-center text-xl font-medium dark:text-white">
                        Browse categories
                    </h2>
                    <div className="mb-16 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3">
                        {help_center_data.map((item) => {
                            const { id, title, text } = item;
                            return (
                                <div
                                    href="#"
                                    key={id}
                                    className="dark:border-jacarta-600 dark:bg-jacarta-700 rounded-2lg border-jacarta-100 border bg-white p-6 text-center transition-shadow hover:shadow-lg"
                                >
                                    <h3 className="font-display text-jacarta-700 mb-2 text-base font-semibold dark:text-white">
                                        {title}
                                    </h3>
                                    <p className="dark:text-jacarta-300">{text}</p>
                                </div>
                            );
                        })}
                    </div>
                    <HelpAccordion data={accordion_data} />
                </div>
            </section>
        </>
    );
};
