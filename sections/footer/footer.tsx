import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/images/logoanft.png';
import { socialIcons } from '@/sections/footer/config';
import { getUser } from '@/requests/queries/getUser';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { useQuery } from 'react-query';
import { User } from 'firebase/auth';

export const Footer = () => {
    const user = useFirebaseAuth();

    const { data: userData } = useQuery({
        queryKey: ['userData', user],
        queryFn: () => getUser((user as User).uid),
        staleTime: 0,
        enabled: !!user?.uid,
    });

    console.log(userData);

    const footerMenuList = [
        {
            id: 1,
            title: 'Marketplace',
            diffClass: '',
            list: [
                {
                    id: 1,
                    href: '/marketplace',
                    text: 'All NFTs',
                },
            ],
        },
        {
            id: 2,
            title: 'Company',
            diffClass: '',
            list: [
                {
                    id: 2,
                    href: '/about',
                    text: 'Meet Our Team',
                },
                {
                    id: 3,
                    href: '/contact',
                    text: 'Contact Us',
                },
                // {
                //     id: 5,
                //     href: '#',
                //     text: 'FAQ',
                // },
            ],
        },
        {
            id: 3,
            title: 'My Account',
            diffClass: '',
            hidden: !user?.uid,
            list: [
                // TODO: reactivate when collections feature is done
                // {
                //     id: 1,
                //     href: '#',
                //     text: 'Collection',
                // },
                {
                    id: 2,
                    href: `/user/${userData?.username}`,
                    text: 'My Profile',
                },
                {
                    id: 3,
                    href: '/create',
                    text: 'Create',
                },
            ],
        },
    ];
    return (
        <>
            <footer className="dark:bg-jacarta-900 bg-white page-footer">
                <div className="container mt-12 p-4 w-full max-w-[90%]">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Logo and Description */}
                        <div className="pr-4">
                            <Link href="#" className="inline-block mb-6">
                                <Image
                                    width="80"
                                    height="80"
                                    src={Logo}
                                    alt="A-NFT | NFT Marketplace"
                                    className="w-[80px] h-[80px] mb-6"
                                />
                            </Link>
                            <p className="dark:text-jacarta-300 mb-6">
                                Create, sell and collect digital artworks worldwide.
                            </p>
                            <p className="dark:text-jacarta-300 mb-12">Powered by Network 3.0</p>
                            {/* Social Icons */}
                            <div className="flex space-x-5">
                                {socialIcons.map((item) => {
                                    const { id, href, icon } = item;
                                    return (
                                        <Link
                                            href={href}
                                            key={id}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group cursor-pointer"
                                        >
                                            {icon}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Menu List */}
                        {/* Dynamically generate the remaining columns for menu items */}
                        {footerMenuList
                            .filter((menuListItem) => !menuListItem.hidden)
                            .map((single, index) => (
                                <div
                                    className={`flex flex-col md:mt-[30px] lg:text-end md:col-span-1 ${
                                        index > 0 ? 'md:ml-auto' : ''
                                    } ${single.diffClass}`}
                                    key={single.id}
                                >
                                    <h3 className="font-display text-jacarta-700 mb-6 text-sm dark:text-white">
                                        {single.title}
                                    </h3>
                                    <ul className="dark:text-jacarta-300 flex flex-col space-y-1">
                                        {single.list.map((item) => {
                                            const { id, href, text } = item;
                                            return (
                                                <li key={id}>
                                                    <Link
                                                        href={href}
                                                        className="hover:text-accent dark:hover:text-white"
                                                    >
                                                        {text}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                    </div>

                    {/* Footer Bottom */}
                    <div className="flex flex-col items-center justify-between space-y-2 py-8 sm:flex-row sm:space-y-0">
                        <span className="dark:text-jacarta-400 text-sm">© {new Date().getFullYear()} A-NFT World</span>

                        <ul className="dark:text-jacarta-400 flex flex-wrap space-x-4 text-sm">
                            <li>
                                <Link href="/terms" className="hover:text-accent dark:hover:text-white">
                                    Terms and conditions
                                </Link>
                            </li>
                            {/*TODO: needs to be written*/}
                            {/*<li>*/}
                            {/*    <Link href="/pages/Terms" className="hover:text-accent dark:hover:text-white">*/}
                            {/*        Privacy policy*/}
                            {/*    </Link>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
};
