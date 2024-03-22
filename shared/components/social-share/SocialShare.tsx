import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FacebookIcon } from '@/shared/components/svgs/FacebookIcon';
import { TwitterIcon } from '@/shared/components/svgs/TwitterIcon';
import { CopyLinkIcon } from '@/shared/components/svgs/CopyLinkIcon';
import { ShareIcon } from '@/shared/components/svgs/ShareIcon';

const SocialShare = () => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        let timeoutId: number | undefined;
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
            <div className="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white">
                <Tippy
                    animation="fade"
                    arrow={false}
                    trigger="click"
                    interactive
                    placement="bottom"
                    className="tooltip-container !bg-transparent"
                    content={
                        <div className="dark:bg-jacarta-800 text-jacarta-700 z-10 min-w-[200px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl show border-2 border-jacarta-600">
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${
                                    window.location.host + window.location.pathname
                                }`}
                                rel="noreferrer"
                                target="_blank"
                                className="dark:hover:bg-jacarta-600 font-display hover:bg-jacarta-50 flex w-full items-center rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
                            >
                                <FacebookIcon className="group-hover:fill-accent fill-jacarta-300 mr-2 h-4 w-4 dark:group-hover:fill-white" />
                                <span className="mt-1 inline-block">Facebook</span>
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    `A-NFT - ${window.location.host + window.location.pathname}`
                                )}`}
                                rel="noreferrer"
                                target="_blank"
                                className="dark:hover:bg-jacarta-600 font-display hover:bg-jacarta-50 flex w-full items-center rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
                            >
                                <TwitterIcon className="group-hover:fill-accent fill-jacarta-300 mr-2 h-4 w-4 dark:group-hover:fill-white" />
                                <span className="mt-1 inline-block">Twitter</span>
                            </a>

                            <div
                                onClick={async () => {
                                    await navigator.clipboard.writeText(
                                        window.location.host + window.location.pathname
                                    );
                                    setIsCopied(true);
                                }}
                                className="dark:hover:bg-jacarta-600 font-display hover:bg-jacarta-50 flex w-full items-center rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white cursor-pointer"
                            >
                                <CopyLinkIcon className="group-hover:fill-accent fill-jacarta-300 mr-2 h-4 w-4 dark:group-hover:fill-white" />
                                <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </div>
                        </div>
                    }
                >
                    <button className="inline-flex h-10 w-10 items-center justify-center text-sm">
                        <ShareIcon className="dark:fill-jacarta-200 fill-jacarta-500 h-4 w-4" />
                    </button>
                </Tippy>
            </div>
        </>
    );
};

export default SocialShare;
