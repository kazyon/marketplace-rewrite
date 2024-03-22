import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyToClipboardIcon } from '@/shared/components/svgs/CopyToClipboardIcon';
import { truncateAddress } from '@/utils/truncateAddress';

interface WalletAddressProps {
    walletAddress?: string;
    classes?: string;
}
export const WalletAddress = ({ walletAddress = '', classes = '' }: WalletAddressProps) => {
    const [copied, setCopied] = useState(false);

    const truncatedAddress = truncateAddress(walletAddress);

    useEffect(() => {
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }, [copied]);

    return (
        <div>
            <Tippy
                hideOnClick={false}
                content={
                    copied ? (
                        <span className="m-2 p-2 inline-block">copied</span>
                    ) : (
                        <span className="m-2 p-2 inline-block">copy</span>
                    )
                }
            >
                <button className={classes}>
                    <CopyToClipboard text={walletAddress} onCopy={() => setCopied(true)}>
                        <span>{truncatedAddress}</span>
                    </CopyToClipboard>

                    <CopyToClipboardIcon className="dark:fill-jacarta-300 fill-jacarta-500 ml-auto mb-px h-4 w-4" />
                </button>
            </Tippy>
        </div>
    );
};
