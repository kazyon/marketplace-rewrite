import React from 'react';
import Meta from '@/shared/components/meta/Meta';
import { EditProfileSection } from '@/sections/profile/EditProfileSection';

const Edit_user = () => {
    return (
        <div>
            <Meta title="A-NFT.World" />
            <div className="mt-40">
                <EditProfileSection />
            </div>
        </div>
    );
};

export default Edit_user;
