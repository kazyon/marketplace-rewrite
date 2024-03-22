import React from 'react';
import { FacebookIcon } from '@/shared/components/svgs/FacebookIcon';
import { TwitterIcon } from '@/shared/components/svgs/TwitterIcon';
import { DiscordIcon } from '@/shared/components/svgs/DiscordIcon';
import { InstagramIcon } from '@/shared/components/svgs/InstagramIcon';
import { TiktokIcon } from '@/shared/components/svgs/TiktokIcon';
import { PiTelegramLogo } from 'react-icons/pi';

export const socialIcons = [
    {
        id: 1,
        href: 'https://www.facebook.com/profile.php?id=61550617410400',
        text: 'facebook',
        icon: (
            <FacebookIcon className="icon group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
        ),
    },
    {
        id: 2,
        href: 'https://twitter.com/TheNetwork_30',
        text: 'twitter',
        icon: (
            <TwitterIcon className="icon group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
        ),
    },
    {
        id: 3,
        href: 'https://discord.gg/7PFSgdvkn3',
        text: 'discord',
        icon: (
            <DiscordIcon className="icon group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
        ),
    },
    {
        id: 4,
        href: 'https://www.instagram.com/anft.world/',
        text: 'instagram',
        icon: (
            <InstagramIcon className="icon group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
        ),
    },
    {
        id: 5,
        href: 'https://www.tiktok.com/@network_3.0',
        text: 'tiktok',
        icon: (
            <TiktokIcon className="icon group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
        ),
    },
    {
        id: 5,
        href: 'https://t.me/+XMcr19jOMEFiMzY0',
        text: 'telegram',
        icon: (
            <PiTelegramLogo className="icon group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white" />
        ),
    },
];
