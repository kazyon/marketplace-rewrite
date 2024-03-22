import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { CryptoChart } from '@/sections/home/components/CryptoChart';
import { MdCurrencyExchange } from 'react-icons/md';
import { useClickOutside } from '@/shared/hooks/useClickOutside';

const CryptoExchangeMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };
    const domNode = useClickOutside(handleClose);

    return (
        <div className="relative" ref={domNode}>
            <button
                onClick={() => {
                    setIsOpen((prevOpen) => !prevOpen);
                }}
                className="border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
            >
                <MdCurrencyExchange className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white" />
            </button>
            <div
                className={classNames(
                    'dark:bg-jacarta-800 !-right-4 !top-[85%] !left-auto z-50 min-w-[16rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute  lg:!translate-y-4 lg:shadow-2xl  border-2 border-jacarta-600',
                    {
                        hidden: !isOpen,
                    }
                )}
            >
                <CryptoChart />
            </div>
        </div>
    );
};

export default CryptoExchangeMenu;
