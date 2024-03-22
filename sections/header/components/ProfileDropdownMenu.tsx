import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { PublicKey } from '@metaplex-foundation/js';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import roundBalance from '@/utils/roundBalance';
import { ProfileIcon } from '@/shared/components/svgs/ProfileIcon';
import classNames from 'classnames';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { getUser } from '@/requests/queries/getUser';
import { useRouter } from 'next/router';
import { AccountContents } from '@/sections/header/components/AccountContents';

const ProfileDropdownMenu = () => {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };
    const domNode = useClickOutside(handleClose);

    const prevPathname = useRef(router.pathname);
    useEffect(() => {
        if (prevPathname.current !== router.pathname) {
            setIsOpen(false);
            prevPathname.current = router.pathname;
        }
    }, [router.pathname]);

    return (
        <div className="relative" ref={domNode}>
            <button
                onClick={() => {
                    setIsOpen((prevOpen) => !prevOpen);
                }}
                className="border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
            >
                <ProfileIcon className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white" />
            </button>
            <div
                className={classNames(
                    'dark:bg-jacarta-800 !-right-4 !top-[85%] !left-auto z-50 min-w-[16rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute  lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl  border-2 border-jacarta-600',
                    {
                        hidden: !isOpen,
                    }
                )}
            >
                <AccountContents />
            </div>
        </div>
    );
};

export default ProfileDropdownMenu;
