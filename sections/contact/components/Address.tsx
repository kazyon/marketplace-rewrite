import React from 'react';
import { PhoneIcon } from '@/shared/components/svgs/PhoneIcon';
import { AddressPinIcon } from '@/shared/components/svgs/AddressPinIcon';
import { EmailIcon } from '@/shared/components/svgs/EmailIcon';

const Address = () => {
    return (
        <div className="lg:w-1/3 lg:pl-5 ">
            <h2 className="font-display text-jacarta-700 mb-4 text-xl dark:text-white">Information</h2>
            <p className="dark:text-jacarta-300 mb-6 text-lg leading-normal"></p>

            <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2.5xl border bg-white p-4 py-8">
                <div className="mb-6 flex items-center space-x-5">
                    <span className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 bg-light-base flex h-11 w-11 shrink-0 items-center justify-center rounded-full border">
                        <PhoneIcon className="fill-jacarta-400" />
                    </span>

                    <div>
                        <span className="font-display text-jacarta-700 block text-base dark:text-white">Phone</span>
                        <a href="tel:123-123-456" className="hover:text-accent dark:text-jacarta-300 text-sm">
                            Phone Number
                        </a>
                    </div>
                </div>

                <div className="mb-6 flex items-center space-x-5">
                    <span className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 bg-light-base flex h-11 w-11 shrink-0 items-center justify-center rounded-full border">
                        <AddressPinIcon className="fill-jacarta-400" />
                    </span>

                    <div>
                        <span className="font-display text-jacarta-700 block text-base dark:text-white">Address</span>
                        <address className="dark:text-jacarta-300 text-sm not-italic">Timisoara Romania</address>
                    </div>
                </div>

                <div className="flex items-center space-x-5">
                    <span className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 bg-light-base flex h-11 w-11 shrink-0 items-center justify-center rounded-full border">
                        <EmailIcon className="fill-jacarta-400" />
                    </span>

                    <div>
                        <span className="font-display text-jacarta-700 block text-base dark:text-white">Email</span>
                        <a
                            href="mailto:network30contact@gmail.com"
                            className="hover:text-accent dark:text-jacarta-300 text-sm not-italic"
                        >
                            network30contact@gmail.com
                        </a>
                    </div>
                </div>
            </div>
            <div className="py-3">
                <button
                    type="submit"
                    className="border border-accent hover:bg-accent-dark rounded-full mt-3 py-3 px-8 text-center font-semibold text-white transition-all "
                    id="contact-form-submit"
                >
                    <a href="https://discord.gg/fhpzevwEfW">Join our Discord </a>
                </button>
            </div>
            <div className="py-3">
                <button
                    type="submit"
                    className="border border-accent hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all "
                    id="contact-form-submit"
                >
                    <a href="https://www.instagram.com/anft.world/">Join our Instagram </a>
                </button>
            </div>
            <div className="py-3">
                <button
                    type="submit"
                    className="border border-accent hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all "
                    id="contact-form-submit"
                >
                    <a href="https://www.facebook.com/people/A-NFT-WORLD/61550617410400/">Join our Facebook </a>
                </button>
            </div>
        </div>
    );
};

export default Address;
