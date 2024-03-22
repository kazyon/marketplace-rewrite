import React from 'react';
import Image from 'next/image';
import Logo from '@/public/images/logoanft.png';

const PageLoading = () => {
    return (
        <div className={'w-[100vw] h-[100vh] flex items-center justify-center'}>
            <div className="animate-spin">
                <Image src={Logo} width={150} height={150} alt="A-NFT Logo" priority />
            </div>
        </div>
    );
};

export default PageLoading;
