import React from 'react';
import 'tippy.js/dist/tippy.css'; // optional
import Meta from '@/shared/components/meta/Meta';
import { UserSection } from '@/sections/user/UserSection';

const User = () => {
    return (
        <>
            <Meta title="A-Nft World" />
            <div className="pt-[5.5rem] lg:pt-24">
                <UserSection />
            </div>
        </>
    );
};

export default User;
