import React from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { auth } from '@/shared/firebase/config';
import PageLoading from '../../sections/root/PageLoading';

export const FirebaseAuthContext = createContext<User | null>(null);

const pagesAllowedWithoutAuth = [
    '/login',
    '/signup',
    '/',
    '/marketplace',
    '/contact',
    '/about',
    '/help_center',
    '/item/[address]',
    '/collection/[address]',
];

const FirebaseAuthProvider = ({ children }: PropsWithChildren) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthStateChecking, setIsAuthStateChecking] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log({ pathname: router.pathname });

            if (user) {
                setUser(user);
            } else {
                setUser(null);
                // not logged in
                if (pagesAllowedWithoutAuth.includes(router.pathname)) {
                    // alert('no logged in');
                    // return;
                } else {
                    router.replace('/');
                }
                // alert('You are not logged in');
                // setUser(null);
                // router.replace('/login');
            }

            setTimeout(() => {
                setIsAuthStateChecking(false);
            }, 200);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <FirebaseAuthContext.Provider value={user}>
            {isAuthStateChecking ? <PageLoading /> : children}
        </FirebaseAuthContext.Provider>
    );
};

export default FirebaseAuthProvider;
