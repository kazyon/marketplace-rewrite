import Image from 'next/image';
import SignupForm from '@/sections/login-register/components/SIgnupForm';
import LoginForm from '@/sections/login-register/components/LoginForm';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const LoginRegisterSection = () => {
    return (
        <div className="xl:flex xl:h-full dark:text-white">
            <div className="relative text-center xl:w-1/2 flex flex-col w-full items-center justify-center">
                <h1 className="font-bold text-[38px] mt-4 tracking-[4px] uppercase z-10 mb-4">
                    <div className="text-jacarta-300 text-xl mb-4">welcome to</div>
                    <div>a-nft.world</div>
                </h1>
                <Image
                    className={
                        'z-10 animate-spin-slow w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] xl:w-[400px] xl:h-[400px]'
                    }
                    src={'/images/logoanft.png'}
                    width={200}
                    height={200}
                    alt="A-NFT Logo"
                    priority
                />
                <Image
                    width={768}
                    height={722}
                    src="/images/login_background.png"
                    alt="login"
                    className="absolute h-full w-full object-cover"
                />
            </div>

            <div className="relative flex items-center justify-center p-[10%] xl:w-1/2">
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

                <div className="w-full max-w-[25.625rem] text-center">
                    <div>
                        <p className="pb-10 text-2xl">Investor Collection Launched</p>
                        <p className="pb-10 text-2xl">Participant Collection Launched</p>
                        <a href="/markeplace">
                            <p className="pb-10 text-2xl text-accent hover:underline">Check Marketplace</p>
                        </a>
                    </div>
                    <SignupForm />
                    <LoginForm />
                    <Link
                        href={'/'}
                        className="mt-8 border border-accent hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                    >
                        Go to A-NFT
                    </Link>
                </div>
            </div>
        </div>
    );
};
