import React, { PropsWithChildren } from 'react';
import Header from '@/sections/header/Header';
import { Footer } from '@/sections/footer/footer';

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header />
            <main className="main relative">{children}</main>
            <Footer />
        </>
    );
}
