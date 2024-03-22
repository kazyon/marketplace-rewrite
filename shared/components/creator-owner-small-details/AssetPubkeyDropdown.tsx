import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ShareIcon } from '@/shared/components/svgs/ShareIcon';
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import { BsClipboard2Fill } from 'react-icons/bs';

type AssetPubkeyDropdownProps = {
    mintAddress: string;
};
export const AssetPubkeyDropdown = ({ mintAddress }: AssetPubkeyDropdownProps) => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;
        if (isCopied) {
            timeoutId = setTimeout(() => {
                setIsCopied(false);
            }, 4000);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isCopied]);

    return (
        <>
            <div className="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white inline-block">
                <Tippy
                    animation="fade"
                    trigger="click"
                    interactive
                    arrow={false}
                    placement="bottom"
                    className="!bg-transparent"
                    content={
                        <div className="dark:bg-jacarta-800 text-jacarta-700 z-10 min-w-[200px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl show border-2 border-jacarta-600">
                            <a
                                href={`https://solscan.io/account/${mintAddress}`}
                                target="_blank"
                                rel="noreferrer"
                                className="dark:hover:bg-jacarta-600 font-display hover:bg-jacarta-50 flex w-full items-center rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
                            >
                                <FaExternalLinkAlt className="group-hover:fill-accent fill-jacarta-300 mr-2 dark:group-hover:fill-white" />
                                {/*<FacebookIcon className="group-hover:fill-accent fill-jacarta-300 mr-2 h-4 w-4 dark:group-hover:fill-white" />*/}
                                <span className="mt-1 inline-block">
                                    View on <span className={'underline'}>solscan.io</span>
                                </span>
                            </a>
                            <a
                                rel="noreferrer"
                                href={`https://explorer.solana.com/address/${mintAddress}`}
                                target="_blank"
                                className="dark:hover:bg-jacarta-600 font-display hover:bg-jacarta-50 flex w-full items-center rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
                            >
                                <FaExternalLinkAlt className="group-hover:fill-accent fill-jacarta-300 mr-2 dark:group-hover:fill-white" />

                                <span className="mt-1 inline-block">
                                    View on <span className={'underline'}>explorer.solana.com</span>
                                </span>
                            </a>

                            <div
                                onClick={async () => {
                                    await navigator.clipboard.writeText(mintAddress);
                                    setIsCopied(true);
                                }}
                                className="dark:hover:bg-jacarta-600 font-display hover:bg-jacarta-50 flex w-full items-center rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white cursor-pointer"
                            >
                                <BsClipboard2Fill
                                    className={
                                        'group-hover:fill-accent fill-jacarta-300 mr-2 dark:group-hover:fill-white'
                                    }
                                />

                                <span className="mt-1">{isCopied ? 'Coped to clipboard' : 'Copy full address'}</span>
                            </div>
                        </div>
                    }
                >
                    <button className="flex m-2">
                        <FaInfoCircle className="dark:fill-jacarta-200 fill-jacarta-500 h-4 w-4" />
                    </button>
                </Tippy>
            </div>
        </>
    );
};
