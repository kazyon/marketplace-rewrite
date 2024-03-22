import React from 'react';
import { PageBanner } from '@/shared/components/page-banner/pageBanner';
import ContactForm from '@/sections/contact/components/ContactForm';
import Address from '@/sections/contact/components/Address';

export const ContactSection = () => {
    return (
        <>
            <PageBanner text="Get in touch" />

            <section className="dark:bg-jacarta-800 relative py-24">
                <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden"></picture>
                <div className="container">
                    <div className="lg:flex">
                        <div className="mb-12 lg:mb-0 lg:w-2/3 lg:pr-12">
                            <h2 className="font-display text-jacarta-700 mb-4 text-xl dark:text-white">Contact Us</h2>
                            <p className="dark:text-jacarta-300 mb-16 text-lg leading-normal">
                                Looking forward to hear from you.
                            </p>
                            <p className="dark:text-jacarta-300 mb-16 text-lg leading-normal">
                                If you encounter issues with our products you can open a ticket on our{' '}
                                <a
                                    className="animate-gradient dark:animate-gradient"
                                    href="https://discord.com/invite/fhpzevwEfW"
                                >
                                    Discord channel
                                </a>
                            </p>
                            <ContactForm />
                        </div>
                        <Address />
                    </div>
                </div>
            </section>
        </>
    );
};
