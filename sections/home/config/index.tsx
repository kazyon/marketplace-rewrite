import { WalletIcon } from '@/shared/components/svgs/WalletIcon';
import { GalleryIcon } from '@/shared/components/svgs/GalleryIcon';
import { ListIcon } from '@/shared/components/svgs/ListIcon';
import React from 'react';

export const newseLatterData = [
    {
        id: '1',
        icon: {
            parentBg: '#beaaf7',
            childBg: 'rgb(131 88 255) ',
            svg: <WalletIcon className="icon icon-wallet h-5 w-5 fill-white" />,
        },

        title: ['Set up your wallet'],
        text: "A-NFT.World supports Phantom Wallet, Trust Wallet and Metamask. Once you've set up your wallet of choice, connect it to A-NFT.World clicking the Auction Button in the top-left corner.",
    },
    {
        id: '2',
        icon: {
            parentBg: '#c4f2e3',
            childBg: 'rgb(16 185 129)',
            svg: <WalletIcon className="icon icon-wallet h-5 w-5 fill-white" />,
        },

        title: ['Create Your Collection'],
        text: 'Click Create and set up your collection. Add social links, a description, profile & banner images, and set a secondary sales fee.',
    },
    {
        id: '3',
        icon: {
            parentBg: '#cddffb',
            childBg: 'rgb(66 138 248)',
            svg: <GalleryIcon className="icon icon-wallet h-5 w-5 fill-white" />,
        },
        title: ['Add Your NFTs'],
        text: 'Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with properties, stats, type.',
    },
    {
        id: '4',
        icon: {
            parentBg: '#ffd0d0',
            childBg: 'rgb(239 68 68)',
            svg: <ListIcon className="icon icon-wallet h-5 w-5 fill-white" />,
        },
        title: ['List Them For Sale'],
        text: 'Feature Available : fixed-price listings, upcoming auctions, and declining-price listings. You choose how you want tosell your NFTs!',
    },
];
