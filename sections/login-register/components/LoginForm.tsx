import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/shared/firebase/config';
import parseFirebaseError from '@/utils/parseFirebaseError';
import VisibilityOffIcon from '@/shared/components/svgs/VisibilityOffIcon';
import VisibilityOnIcon from '@/shared/components/svgs/VisibilityOnIcon';
import Spinner from '@/shared/components/spinner/Spinner';
import basicPasswordCheck from '@/utils/basicPasswordCheck';

const LoginForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [viewPassword, setViewPassword] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    const [isLoading, setIsLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState('');

    const sendPasswordReset = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!email) {
            setResetMessage('Please enter your email address.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setResetMessage('Check your email to reset your password.');
        } catch (error) {
            if (error instanceof Error) {
                setResetMessage('Error: ' + error.message);
            } else {
                setResetMessage('An unknown error occurred');
            }
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                router.replace('/');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const changeEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
    };

    const changePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
    };

    const viewPasswordHandler = () => {
        setViewPassword((prev) => !prev);
    };

    const handleSignIn = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const check = basicPasswordCheck(password);

            if (check === true) {
                setIsLoading(true);
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (!userCredential.user.emailVerified) {
                    setError('Please verify your email address to log in.');
                    auth.signOut();
                }
            } else {
                setError(check);
            }
        } catch (error) {
            const e = error as { code: string };
            console.error(e);
            setError(parseFirebaseError(e.code));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <button
                    onClick={onOpenModal}
                    className="mt-8 border border-accent hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                >
                    Log in
                </button>
                <Modal
                    open={open}
                    onClose={onCloseModal}
                    center
                    styles={{
                        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                        modal: {
                            backgroundColor: '#0d102d',
                            width: '100%',
                            maxWidth: '500px',
                            marginLeft: '0',
                        },
                        closeButton: {
                            fill: '#fff',
                            top: '25px',
                            right: '25px',
                        },
                    }}
                >
                    <div className="login">
                        <h1 className="form-title text-white">Log in</h1>
                        <form onSubmit={handleSignIn}>
                            <div className="form-group">
                                <label htmlFor="email" className="text-white">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                    onChange={changeEmailHandler}
                                />
                            </div>
                            <div className="relative form-group">
                                <label htmlFor="password" className="text-white">
                                    Password
                                </label>
                                <input
                                    type={viewPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={changePasswordHandler}
                                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                />
                                <span
                                    className="absolute p-0 w-fit top-10 right-6 cursor-pointer"
                                    title={viewPassword ? 'Hide password' : 'View password'}
                                    onClick={viewPasswordHandler}
                                >
                                    {viewPassword ? (
                                        <VisibilityOffIcon className="fill-jacarta-200" />
                                    ) : (
                                        <VisibilityOnIcon className="fill-jacarta-200" />
                                    )}
                                </span>
                            </div>
                            <p className="text-red-500 -500 normal-case">{error}</p>
                            <button
                                type="submit"
                                className="mt-8 bg-accent shadow-accent-volume hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                            >
                                {isLoading ? <Spinner /> : 'Login'}
                            </button>
                            <button
                                onClick={(e) => sendPasswordReset(e)}
                                className="mt-4 text-sm text-accent hover:underline"
                            >
                                Forgot Password?
                            </button>
                            <p className="text-green normal-case">{resetMessage}</p>{' '}
                        </form>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default LoginForm;
