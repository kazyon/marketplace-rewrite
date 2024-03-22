import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isChildrenPageActive } from '@/utils/daynamicNavigation';
import Logo from '@/public/images/logoanft.png';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import CryptoExchangeMenu from '@/sections/header/components/CryptoExchangeMenu';
import { CloseIcon } from '@/shared/components/svgs/CloseIcon';
import { TiktokIcon } from '@/shared/components/svgs/TiktokIcon';
import { InstagramIcon } from '@/shared/components/svgs/InstagramIcon';
import { DiscordIcon } from '@/shared/components/svgs/DiscordIcon';
import { TwitterIcon } from '@/shared/components/svgs/TwitterIcon';
import { FacebookIcon } from '@/shared/components/svgs/FacebookIcon';
import { MenuIcon } from '@/shared/components/svgs/MenuIcon';
import { CryptoChart } from '../home/components/CryptoChart';
import ProfileDropdownMenu from '@/sections/header/components/ProfileDropdownMenu';
import { AccountContents } from '@/sections/header/components/AccountContents';
import Banner from '@/sections/header/components/banner';
export default function Header() {
    const [toggle, setToggle] = useState(false);

    const user = useFirebaseAuth();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setToggle(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    });

    const route = useRouter();

    return (
        <>
            <header className="js-page-header fixed top-0 z-50 w-full backdrop-blur transition-colors pt-30">
                <Banner />
                <div className="flex items-center py-1 px-4 xl:px-24 gap-8">
                    <Link className="shrink-0" href="/">
                        <div className="dark:hidden">
                            <Image
                                src={Logo}
                                className="w-[85px] h-[85px]"
                                sizes="100vw"
                                width="0"
                                height="0"
                                alt="A-NFT Logo"
                            />
                        </div>
                        <div className="hidden dark:block">
                            <Image
                                src={Logo}
                                className="w-[85px] h-[85px]"
                                sizes="100vw"
                                width="0"
                                height="0"
                                alt="A-NFT Logo"
                            />
                        </div>
                    </Link>
                    {/* <Banner /> */}
                    <div className="js-mobile-menu dark:bg-jacarta-800 invisible fixed inset-0 z-10 items-center w-full bg-white opacity-0 lg:visible lg:relative lg:inset-auto lg:flex lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent">
                        <nav className="navbar w-full">
                            <ul className="flex flex-col lg:flex-row">
                                <li className="group" onClick={() => setToggle(false)}>
                                    <Link href="/marketplace">
                                        <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                            <span
                                                className={
                                                    isChildrenPageActive('/marketplace', route.asPath)
                                                        ? 'text-accent dark:animate-gradient'
                                                        : ''
                                                }
                                            >
                                                Marketplace
                                            </span>
                                        </button>
                                    </Link>
                                </li>

                                {user?.uid ? (
                                    <li className="group" onClick={() => setToggle(false)}>
                                        <Link href="/create">
                                            <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                                <span
                                                    className={
                                                        isChildrenPageActive('/create', route.asPath)
                                                            ? 'animate-gradient dark:animate-gradient'
                                                            : ''
                                                    }
                                                >
                                                    Create
                                                </span>
                                            </button>
                                        </Link>
                                    </li>
                                ) : null}

                                <li className="group" onClick={() => setToggle(false)}>
                                    <Link href="/help_center">
                                        <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                            <span
                                                className={
                                                    isChildrenPageActive('/help_center', route.asPath)
                                                        ? 'animate-gradient dark:animate-gradient'
                                                        : ''
                                                }
                                            >
                                                Help
                                            </span>
                                        </button>
                                    </Link>
                                </li>

                                <li className="group" onClick={() => setToggle(false)}>
                                    <Link href="/about">
                                        <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                            <span
                                                className={
                                                    isChildrenPageActive('/about', route.asPath)
                                                        ? 'animate-gradient dark:animate-gradient'
                                                        : ''
                                                }
                                            >
                                                About
                                            </span>
                                        </button>
                                    </Link>
                                </li>

                                <li className="group" onClick={() => setToggle(false)}>
                                    <Link href="/contact">
                                        <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                            <span
                                                className={
                                                    isChildrenPageActive('/contact', route.asPath)
                                                        ? 'animate-gradient dark:animate-gradient'
                                                        : ''
                                                }
                                            >
                                                Contact
                                            </span>
                                        </button>
                                    </Link>
                                </li>

                                {!user?.uid ? (
                                    <li className="group ml-auto" onClick={() => setToggle(false)}>
                                        <Link href="/login">
                                            <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                                <span>Register/Login</span>
                                            </button>
                                        </Link>
                                    </li>
                                ) : null}
                            </ul>
                        </nav>

                        <div className="ml-8 gap-20 hidden items-center lg:flex xl:ml-12">
                            {user ? (
                                <>
                                    {/*<HeaderWalletButton />*/}
                                    <CryptoExchangeMenu />
                                </>
                            ) : null}
                            {/*<DarkMode />*/}
                        </div>

                        <div className="ml-2 gap-20 items-center lg:flex xl:ml-2">
                            {user ? (
                                <>
                                    <ProfileDropdownMenu />
                                </>
                            ) : null}
                        </div>
                    </div>

                    <div className="ml-auto flex lg:hidden">
                        <button
                            className="js-mobile-toggle border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                            aria-label="open mobile menu"
                            onClick={() => setToggle(true)}
                        >
                            <MenuIcon className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white" />
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`lg:hidden dark:bg-jacarta-800 invisible fixed inset-0 z-50 ml-auto items-center bg-white opacity-0 lg:visible lg:relative lg:inset-auto lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent ${
                    toggle ? 'nav-menu--is-open' : 'hidden'
                }`}
            >
                <div className="t-0 dark:bg-jacarta-800 fixed left-0 z-10 flex w-full items-center justify-between bg-white p-6 lg:hidden">
                    <Link className="shrink-0" href="/">
                        <div className="dark:hidden">
                            <Image src={Logo} height={85} width={85} alt="A-NFT.World" className="h-auto " />
                        </div>

                        <div className="hidden dark:block">
                            <Image src={Logo} height={85} width={85} alt="A-NFT.World" />
                        </div>
                    </Link>

                    <button
                        className="border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                        onClick={() => setToggle(false)}
                    >
                        <CloseIcon className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white" />
                    </button>
                </div>

                <div className="relative mt-24 lg:hidden"></div>

                <nav className="navbar w-full">
                    <ul className="flex flex-col lg:flex-row">
                        <li className="group" onClick={() => setToggle(false)}></li>
                    </ul>
                </nav>

                <div className="w-full lg:hidden list-none mt-8">
                    <li className="group" onClick={() => setToggle(false)}>
                        <Link href="/marketplace">
                            <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                <span
                                    className={
                                        isChildrenPageActive('auction', route.asPath)
                                            ? 'text-accent dark:text-accent'
                                            : ''
                                    }
                                >
                                    Marketplace
                                </span>
                            </button>
                        </Link>
                    </li>

                    {user?.uid ? (
                        <li className="group" onClick={() => setToggle(false)}>
                            <Link href="/create">
                                <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                    <span
                                        className={
                                            isChildrenPageActive('auction', route.asPath)
                                                ? 'text-accent dark:text-accent'
                                                : ''
                                        }
                                    >
                                        Create
                                    </span>
                                </button>
                            </Link>
                        </li>
                    ) : null}

                    <li className="group" onClick={() => setToggle(false)}>
                        <Link href="/help_center">
                            <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                <span
                                    className={
                                        isChildrenPageActive('/help_center', route.asPath)
                                            ? 'text-accent dark:text-accent'
                                            : ''
                                    }
                                >
                                    Help
                                </span>
                            </button>
                        </Link>
                    </li>

                    <li className="group" onClick={() => setToggle(false)}>
                        <Link href="/about">
                            <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                <span
                                    className={
                                        isChildrenPageActive('/about', route.asPath)
                                            ? 'text-accent dark:text-accent'
                                            : ''
                                    }
                                >
                                    About
                                </span>
                            </button>
                        </Link>
                    </li>

                    <li className="group" onClick={() => setToggle(false)}>
                        <Link href="/contact">
                            <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                <span
                                    className={
                                        isChildrenPageActive('/contact', route.asPath)
                                            ? 'text-accent dark:text-accent'
                                            : ''
                                    }
                                >
                                    Contact
                                </span>
                            </button>
                        </Link>
                    </li>
                    <li className="group" onClick={() => setToggle(false)}>
                        <Link href="/login">
                            <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                                <span
                                    className={
                                        isChildrenPageActive('/login', route.asPath)
                                            ? 'text-accent dark:text-accent'
                                            : ''
                                    }
                                >
                                    Sign in/Sign up
                                </span>
                            </button>
                        </Link>
                    </li>

                    {user ? (
                        <div className="dark:bg-jacarta-800 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform my-4 py-4 border-2 border-jacarta-600">
                            <AccountContents />
                        </div>
                    ) : null}

                    <hr className="dark:bg-jacarta-600 bg-jacarta-100 my-5 h-px border-0" />
                    <div className="flex items-center justify-center space-x-5">
                        <a className="group">
                            <FacebookIcon className="group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
                        </a>
                        <a className="group">
                            <TwitterIcon className="group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
                        </a>
                        <a className="group">
                            <DiscordIcon className="group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
                        </a>
                        <a className="group">
                            <InstagramIcon className="group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
                        </a>
                        <a className="group">
                            <TiktokIcon className="group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
