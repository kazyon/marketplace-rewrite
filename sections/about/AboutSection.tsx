import React from 'react';
import Link from 'next/link';
import { collaborators, teamMembers } from '@/sections/about/config/config';
import Image from 'next/image';
import { LinkedInIcon } from '@/shared/components/svgs/LinkedInIcon';
import { Heading } from '@/shared/components/heading/Heading';

export const AboutSection = () => {
    return (
        <div className="container">
            <Heading
                text="Meet Our Amazing Team"
                classes="font-display text-jacarta-700 mb-12 text-center text-3xl dark:text-white"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-[1.875rem] lg:grid-cols-4">
                {teamMembers.map((item) => {
                    const { id, image, title, name, url, easterEgg } = item;
                    return (
                        <div
                            className="group dark:bg-jacarta-700 rounded-2lg dark:border-jacarta-600 border-jacarta-100 border bg-white p-8 text-center transition-shadow hover:shadow-lg"
                            key={id}
                        >
                            <Image
                                width={130}
                                height={130}
                                src={image}
                                className="group-hover:hidden rounded-2.5xl mx-auto mb-6 h-[8.125rem] w-[8.125rem] object-cover"
                                alt={name}
                            />

                            <Image
                                width={130}
                                height={130}
                                src={easterEgg}
                                className="group-hover:inline-block hidden rounded-2.5xl mx-auto mb-6 h-[8.125rem] w-[8.125rem] object-cover"
                                alt={name}
                            />
                            <h3 className="font-display text-jacarta-700 text-md dark:text-white">{name}</h3>
                            <span className="text-jacarta-400 text-2xs font-medium tracking-tight">{title}</span>
                            <div className="mt-3 flex justify-center space-x-5">
                                {/*TODO: links point to nowhere*/}
                                <Link href={url} className="group">
                                    <LinkedInIcon className="group-hover:fill-accent fill-jacarta-300 h-4 w-4 dark:group-hover:fill-white" />
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {/*TODO: links points to nowhere*/}
                <Link
                    href="/contact"
                    className="text-accent hover:underline dark:bg-jacarta-700 rounded-2lg dark:border-jacarta-600 border-jacarta-100 flex items-center justify-center border bg-white p-8 text-center transition-shadow hover:shadow-lg"
                >
                    Join us!
                </Link>
            </div>
            <Heading
                text="Meet our Collaborators"
                classes="font-display text-jacarta-700 mb-12 text-center text-3xl dark:text-white mt-10"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-[1.875rem] lg:grid-cols-5 ">
                {collaborators.map((item) => {
                    const { id, image, title, name, url, easterEgg } = item;
                    return (
                        <div
                            className="group dark:bg-jacarta-700 rounded-2lg dark:border-jacarta-600 border-jacarta-100 border bg-white p-8 text-center transition-shadow hover:shadow-lg"
                            key={id}
                        >
                            <Image
                                width={130}
                                height={130}
                                src={image}
                                className="group-hover:hidden rounded-2.5xl mx-auto mb-6 h-[8.125rem] w-[8.125rem] object-cover"
                                alt={name}
                            />

                            <Image
                                width={130}
                                height={130}
                                src={image}
                                className="group-hover:inline-block hidden rounded-2.5xl mx-auto mb-6 h-[8.125rem] w-[8.125rem] object-cover"
                                alt={name}
                            />
                            <h3 className="font-display text-jacarta-700 text-md dark:text-white">{name}</h3>
                            <span className="text-jacarta-400 text-2xs font-medium tracking-tight">{title}</span>
                            <div className="mt-3 flex justify-center space-x-5">
                                {/*TODO: links point to nowhere*/}
                                <Link href={url} className="group">
                                    <LinkedInIcon className="group-hover:fill-accent fill-jacarta-300 h-4 w-4 dark:group-hover:fill-white" />
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {/*TODO: links points to nowhere*/}
                <Link
                    href="/contact"
                    className="text-accent hover:underline dark:bg-jacarta-700 rounded-2lg dark:border-jacarta-600 border-jacarta-100 flex items-center justify-center border bg-white p-8 text-center transition-shadow hover:shadow-lg"
                >
                    Join us!
                </Link>
            </div>
        </div>
    );
};

export const Collaborators = () => {};
