import React from 'react';
import 'react-tabs/style/react-tabs.css';
import Meta from '@/shared/components/meta/Meta';
import { LoginRegisterSection } from '@/sections/login-register/LoginRegisterSection';

const Login = () => {
    return (
        <div>
            <Meta title="A-Nft World" />
            <section className="relative h-screen">
                <LoginRegisterSection />
            </section>
        </div>
    );
};

export default Login;
