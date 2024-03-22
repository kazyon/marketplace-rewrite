import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import debounce from 'lodash/debounce';
import { AutocompleteAddress } from '@/shared/components/address-autocomplete/AddressAutocomplete';
import { z } from 'zod';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { useMutation, useQuery } from 'react-query';
import { signUp } from '@/requests/mutations/signUp';
import Spinner from '@/shared/components/spinner/Spinner';
import WalletMultiButton from '@/shared/components/wallet-multi-button/WalletMultiButton';
import parseFirebaseError from '@/utils/parseFirebaseError';
import VisibilityOffIcon from '@/shared/components/svgs/VisibilityOffIcon';
import VisibilityOnIcon from '@/shared/components/svgs/VisibilityOnIcon';
import BackIcon from '@/shared/components/svgs/BackIcon';
import { getPubkeyAvailability } from '@/requests/queries/getPubkeyAvailability';
import { getUsernameAvailability } from '@/requests/queries/getUsernameAvailability';

const formSchema = z
    .object({
        firstName: z.string().min(1, 'Name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().min(1, 'Email is required').email('Please insert a valid email'),
        password: z.string().min(6, 'Password must be minimum of 6 characters'),
        confirmPassword: z.string().min(6, 'Password must be minimum of 6 characters'),
        pubkey: z.object({
            key: z.string().min(1, 'Public Key is required'),
            signedMessage: z.string().min(1, 'Invalid sign message'),
        }),
        username: z
            .string()
            .min(1, 'Username is required')
            .min(3, 'Username must be at least 3 characters long')
            .max(15, "Username can't be more than 15 characters long")
            .regex(/^[a-zA-Z0-9_.-]+$/im, 'Must contain only letters (A-Z, a-z), numbers, _, . or -'),
        phone: z.string().min(1, 'Phone is required'),
        address: z.object({
            addressAsString: z.string().min(1, 'Address is required'),
            lat: z.string().nullish(),
            long: z.string().nullish(),
            placeId: z.string().nullish(),
        }),
        addressDetails: z.any(),
        // TODO: maybe validate this?
        postalCode: z.string().min(1, 'Postal code is required'),
    })
    .refine(
        (values) => {
            if (!values.confirmPassword || !values.password) {
                return true;
            }
            return values.password === values.confirmPassword;
        },
        {
            message: 'Password do not match',
            path: ['confirmPassword'],
        }
    );

export type FormValues = z.infer<typeof formSchema>;

const SignupForm = () => {
    const router = useRouter();
    const { signMessage, publicKey, select, connected } = useWallet();
    const [error, setError] = useState('');

    const signUpMutation = useMutation(signUp, {
        onSuccess: () => {
            router.replace('/');
        },
        onError: (error) => {
            if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
                setError(parseFirebaseError(error.code));
            }
        },
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            pubkey: {
                key: '',
                signedMessage: '',
            },
            username: '',
            phone: '',
            address: {
                addressAsString: '',
            },
            postalCode: '',
            addressDetails: null,
        },
        validate: (values) => {
            const result = formSchema.safeParse(values);
            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                type FieldErrors = typeof fieldErrors & { [key: string]: string };
                for (const key in fieldErrors as FieldErrors) {
                    (fieldErrors as FieldErrors)[key] = (fieldErrors as FieldErrors)[key][0];
                }
                return fieldErrors;
            }
        },
        onSubmit: (values) => {
            signUpMutation.mutate({
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                pubkey: values.pubkey,
                phone: values.phone,
                address: values.address,
                postalCode: values.postalCode,
                addressDetails: values.addressDetails,
            });
        },
    });

    const {
        values: { username, firstName, lastName, email, password, confirmPassword, pubkey, phone, postalCode },
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        validateField,
        submitForm,
    } = formik;

    const [viewPassword, setViewPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [open, setOpen] = useState(false);

    // const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

    const { data: usernameAvailability, refetch: refetchUsernameAvailability } = useQuery({
        queryKey: ['username-availability', username],
        queryFn: () => getUsernameAvailability(username),
        staleTime: 0,
        enabled: !!username && !errors.username,
    });

    const getUsernameAvailabilityDeounced = useCallback(
        debounce(() => {
            refetchUsernameAvailability();
        }, 1000),
        []
    );

    useEffect(() => {
        getUsernameAvailabilityDeounced();
    }, [username]);

    const { data: isPubkeyAvailable, refetch: refetchPubkeyAvailability } = useQuery({
        queryKey: ['pubkey-availability', pubkey.key],
        queryFn: () => getPubkeyAvailability(pubkey.key),
        staleTime: 0,
        enabled: !!pubkey?.key,
    });

    // useEffect(() => {
    //     if (pubkey.key) {
    //         refetchPubkeyAvailability();
    //     }
    // }, [pubkey.key]);
    //
    // useEffect(() => {
    //     select(null);
    // }, []);

    // useEffect(() => {
    //     if (!connected || !publicKey?.toString()) {
    //         select(null);
    //         setFieldValue('pubkey', {
    //             key: '',
    //             signedMessage: '',
    //         });
    //     }
    // }, [connected, publicKey?.toString()]);
    useEffect(() => {
        const signAndConnectWallet = async () => {
            if (!signMessage) {
                throw new Error('No signMessages');
            }

            if (!publicKey) {
                throw new Error('No pubkey');
            }
            const encoder = new TextEncoder();

            try {
                const signedMessage = await signMessage(
                    // !!!DO NOT SIMPLY CHANGE THE MESSAGE AS THAT SAME MESSAGE IS ALSO CHECKED ON THE BACKEND ON SIGNUP!!
                    encoder.encode(`Associate the address: ${publicKey.toString()} to the account`)
                );

                const serialized = Buffer.from(signedMessage).toString('base64');

                setFieldValue('pubkey', { key: publicKey.toString(), signedMessage: serialized }, true);
                // validateField('pubkey');
            } catch {
                setFieldValue('pubkey', {
                    key: '',
                    signedMessage: '',
                });
                select(null);
            }
        };

        if (publicKey?.toString()) {
            signAndConnectWallet();
        }
    }, [publicKey?.toString()]);

    const onOpenModal = () => {
        setOpen(true);
    };
    const onCloseModal = () => {
        setOpen(false);
    };

    const handleRejectTerms = () => {
        setError('You must accept the terms and conditions before you can proceed to the next step');
    };

    const backButtonHandler = () => {
        setError('');
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const viewPasswordHandler = () => {
        setViewPassword((prev) => !prev);
    };

    const handleFirstStep = (e: React.MouseEvent) => {
        e.preventDefault();
        setFieldTouched('email', true);
        setFieldTouched('password', true);
        setFieldTouched('confirmPassword', true);

        if (!errors.password && !errors.confirmPassword && !errors.email) {
            setCurrentStep(2);
        }
    };

    const handleSecondStep = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentStep(3);
    };

    const handleSignUp = async (e: React.SyntheticEvent) => {
        e.preventDefault();
    };

    const isFirstStepInvalid = !!(errors.email || errors.password || errors.confirmPassword);

    const formValid = true;

    return (
        <>
            <div>
                <button
                    onClick={onOpenModal}
                    className="border border-accent hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                >
                    Sign up
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
                            maxWidth: '600px',
                            marginLeft: '0',
                        },
                        closeButton: {
                            fill: '#fff',
                            top: '35px',
                            right: '35px',
                        },
                    }}
                >
                    {currentStep === 1 ? (
                        <div className="login">
                            {/* change classname later */}
                            <h1 className="form-title text-white">Sign up</h1>
                            {/*<form onSubmit={handleFirstStep}>*/}
                            <div className="form-group">
                                <label htmlFor="email" className="text-white">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    // onBlur={handleBlur}
                                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                    onChange={handleChange}
                                />
                                {touched.email && errors.email && (
                                    <p className="text-red-500 -500 normal-case mt-2">{errors.email}</p>
                                )}
                            </div>

                            <div className="relative form-group">
                                <label htmlFor="password text-white">Password</label>
                                <input
                                    type={viewPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    onBlur={handleBlur}
                                    value={password}
                                    onChange={handleChange}
                                    className={
                                        'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white'
                                    }
                                />
                                <span
                                    className="absolute p-0 w-fit top-10 right-6 cursor-pointer"
                                    title={viewPassword ? 'Hide password' : 'View password'}
                                    onClick={viewPasswordHandler}
                                >
                                    {viewPassword ? (
                                        <VisibilityOffIcon className={'fill-jacarta-200'} />
                                    ) : (
                                        <VisibilityOnIcon className={'fill-jacarta-200'} />
                                    )}
                                </span>
                                {touched.password && errors.password && (
                                    <p className="text-red-500 -500 normal-case mt-2">{errors.password}</p>
                                )}
                            </div>

                            <div className="relative form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type={viewPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    required
                                    className={
                                        'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white'
                                    }
                                />
                                <span
                                    className="absolute p-0 w-fit top-10 right-6 cursor-pointer"
                                    title={viewPassword ? 'Hide password' : 'View password'}
                                    onClick={viewPasswordHandler}
                                >
                                    {viewPassword ? (
                                        <VisibilityOffIcon className="fill-jacarta-200" />
                                    ) : (
                                        <VisibilityOnIcon className={'fill-jacarta-200'} />
                                    )}
                                </span>
                                {touched.confirmPassword && touched.confirmPassword && (
                                    <p className="text-red-500 -500 normal-case mt-2">{errors.confirmPassword}</p>
                                )}
                            </div>
                            {/*<p className="text-red-500 -500 normal-case">{error}</p>*/}
                            <button
                                onClick={handleFirstStep}
                                className={classNames(
                                    'mt-8 bg-accent  hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all',
                                    {
                                        'bg-jacarta-500': isFirstStepInvalid,
                                        'shadow-accent-volume': !isFirstStepInvalid,
                                    }
                                )}
                            >
                                Next
                            </button>
                            {/*</form>*/}
                        </div>
                    ) : null}

                    {currentStep === 2 ? (
                        <div className="login">
                            <button
                                className="border-jacarta-100 mb-3 absolute top-2 left-2 flex h-10 w-10 items-center justify-center rounded-full border-transparent bg-transparent transition-colors hover:border-transparent focus:border-transparent dark:border-transparent"
                                onClick={backButtonHandler}
                            >
                                <BackIcon />
                            </button>
                            <h1 className="form-title text-white mt-8">Terms and conditions</h1>
                            <form>
                                <div className="text-white mb-4 terms max-h-[400px] overflow-y-auto p-4 border border-gray-300">
                                    <h5 className="font-bold">Acceptance of Terms</h5>
                                    <p>
                                        1.1. By accessing or using the A-NFT Marketplace, you agree to comply with and
                                        be bound by these Terms and Conditions.
                                        <br />
                                        1.2. If you do not agree with any part of these terms, you may not access the
                                        platform.
                                    </p>
                                    <br />
                                    <br />
                                    <h5 className="font-bold">Platform Usage</h5>
                                    <br />
                                    <p>
                                        2.1. A-NFT Marketplace provides a platform for users to buy, sell, and trade
                                        NFTs and physical art.
                                        <br />
                                        2.2. Users must be at least 18 years old to access and use the platform.
                                        <br />
                                        2.3. Users are solely responsible for all activities conducted through their
                                        accounts.
                                    </p>
                                    <br />
                                    <br />
                                    <h5 className="font-bold">NFTs and Physical Art</h5>
                                    <br />
                                    <p>
                                        3.1. A-NFT Marketplace facilitates the trading of both digital NFTs and physical
                                        art.
                                        <br />
                                        3.2. When purchasing physical art, users agree to the terms and conditions set
                                        forth by DHL for shipping and delivery.
                                        <br />
                                        3.3. A-NFT Marketplace does not take responsibility for any damages or losses
                                        that occur during shipping. Users should refer to DHL's terms and conditions for
                                        any claims or disputes related to shipping.
                                    </p>
                                    <br />
                                    <br />
                                    <h5 className="font-bold">Contract Agreement</h5>
                                    <br />
                                    4.1. Users may engage in transactions with other users based on contracts made
                                    available on a user base form.
                                    <br />
                                    4.2. It is the responsibility of the users to ensure that contracts are legally
                                    binding and enforceable.
                                    <br />
                                    4.3. A-NFT Marketplace does not guarantee the fulfillment of any contracts entered
                                    into by users.
                                    <br />
                                    <br />
                                    <h5 className="font-bold">Fees</h5>
                                    <br />
                                    <p>
                                        5.1. A-NFT Marketplace may charge fees for certain transactions conducted
                                        through the platform. These fees will be clearly communicated to users before
                                        completing the transaction.
                                    </p>
                                    <br />
                                    <br />
                                    <h5 className="font-bold">Content Guidelines</h5>
                                    <br />
                                    <p>
                                        6.1. Users are solely responsible for the content they upload to A-NFT
                                        Marketplace. 6.2. Content must not violate any laws or regulations or infringe
                                        upon the rights of any third party.
                                        <br />
                                        6.3. A-NFT Marketplace reserves the right to remove any content that violates
                                        these guidelines without prior notice.
                                    </p>
                                    <h5 className="font-bold">Disclaimer of Waranties</h5>
                                    <br />
                                    <p>
                                        7.1. A-NFT Marketplace is provided "as is" and without warranty of any kind. We
                                        make no representations or warranties of any kind, express or implied, regarding
                                        the platform or the content available on it.
                                    </p>
                                    <br />
                                    <br />
                                    <h5 className="font-bold">Limitation of Liability</h5>
                                    <br />
                                    <p>
                                        8.1. A-NFT Marketplace shall not be liable for any direct, indirect, incidental,
                                        special, consequential, or punitive damages arising out of or in any way
                                        connected with the use of the platform.
                                    </p>
                                    <br />
                                    <br />
                                    <h5 className="font-bold">Contact Us</h5>
                                    <br />
                                    <p>
                                        9.1. If you have any questions or concerns about these Terms and Conditions,
                                        please contact us using the Discord link from A-NFT.World
                                    </p>
                                    <br />
                                    <br />
                                    <h5 className="font-bold">Changes of Terms</h5>
                                    <br />
                                    <p>
                                        10.1. A-NFT Marketplace reserves the right to modify or update these Terms and
                                        Conditions at any time without prior notice. Users are encouraged to review
                                        these terms periodically for changes. By using A-NFT Marketplace, you agree to
                                        be bound by the most current version of these Terms and Conditions.
                                    </p>
                                </div>
                                <p className="text-red-500 -500 normal-case">{error}</p>
                                <div>
                                    <button
                                        onClick={handleSecondStep}
                                        type="submit"
                                        className="mt-4 bg-accent shadow-accent-volume hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-4 bg-accent shadow-accent-volume hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                                        onClick={handleRejectTerms}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : null}

                    {currentStep === 3 ? (
                        <div className="login">
                            <button
                                className="border-jacarta-100 mb-3 absolute top-2 left-2 flex h-10 w-10 items-center justify-center rounded-full border-transparent bg-transparent transition-colors hover:border-transparent focus:border-transparent dark:border-transparent"
                                onClick={backButtonHandler}
                            >
                                <BackIcon />
                            </button>
                            <h1 className="form-title text-white mt-8">Personal details</h1>
                            <form
                                onSubmit={handleSignUp}
                                className="h-full max-h-[75vh] flex flex-col overflow-y-auto"
                                autoComplete="new-password"
                            >
                                <div className="form-group">
                                    <label htmlFor="username" className="text-white">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <div>
                                        {!(touched.username && errors.username) && username ? (
                                            usernameAvailability ? (
                                                <div className="text-green">Available</div>
                                            ) : (
                                                <div className="text-red-500 ">Not available</div>
                                            )
                                        ) : null}
                                    </div>
                                    {touched.username && errors.username && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.username}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="firstName" className="text-white">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        name={'firstName'}
                                        className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.firstName}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName" className="text-white">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.lastName}</p>
                                    )}
                                </div>

                                <div className="form-group wallet-container">
                                    <div className="pubkey">
                                        <label htmlFor="pubkey">Wallet Address</label>
                                        <input
                                            type="text"
                                            id="pubkey"
                                            value={pubkey.key}
                                            className="text-gray-500 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                            placeholder="Select an account from your wallet"
                                            // onChange={handleChange}
                                            // onBlur={handleBlur}
                                            disabled
                                        />
                                    </div>

                                    <div className="min-w-[10rem]">
                                        <WalletMultiButton />
                                    </div>
                                </div>
                                {touched.pubkey && errors.pubkey && (
                                    <p className="text-red-500 -500 normal-case">{errors.pubkey}</p>
                                )}

                                {isPubkeyAvailable === false ? (
                                    <p className="text-red-500 -500 normal-case">
                                        Public key is already used on another account
                                    </p>
                                ) : null}
                                <div className="mt-4">
                                    <p className="text-white ">Street Address</p>
                                    <AutocompleteAddress
                                        onChange={(data) => {
                                            setFieldValue('address', data);
                                            setFieldTouched('address', true);
                                            setFieldValue('addressDetails', data.addressComponents);
                                        }}
                                        placeholder={'Type in your street address and number'}
                                        inputClassName={
                                            'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white'
                                        }
                                    />
                                    {touched.address && errors.address && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.address}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone" className="text-white">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        value={postalCode}
                                        className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                        onChange={handleChange}
                                    />
                                    {touched.postalCode && errors.postalCode && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.postalCode}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone" className="text-white">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        value={phone}
                                        className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                                        onChange={handleChange}
                                    />
                                    {touched.phone && errors.phone && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.phone}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        if (formValid) {
                                            submitForm();
                                        }
                                    }}
                                    // className="mt-2 bg-accent shadow-accent-volume hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                                    className={classNames(
                                        'mt-8 bg-accent  hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all',
                                        {
                                            'bg-jacarta-500': !formValid,
                                            'shadow-accent-volume': formValid,
                                        }
                                    )}
                                >
                                    {signUpMutation.isLoading ? <Spinner /> : 'Sign up'}
                                </button>
                                {error && <p className="text-red-500 -500 normal-case mt-2 text-center">{error}</p>}
                            </form>
                        </div>
                    ) : null}
                </Modal>
            </div>
        </>
    );
};

export default SignupForm;
