import { WithInjectedFirebaseImage } from '@/shared/components/inject-firebse-image-hoc/WithInjectedFirebaseImage';
import Skeleton from 'tiny-skeleton-loader-react';
import { BiSolidErrorCircle } from 'react-icons/bi';
import Image from 'next/image';
import { PencilEditIcon } from '@/shared/components/svgs/PencilEditIcon';
import { PiWarningOctagon } from 'react-icons/pi';
import classNames from 'classnames';
import { AutocompleteAddress, PlaceDetails } from '@/shared/components/address-autocomplete/AddressAutocomplete';
import { FacebookIcon } from '@/shared/components/svgs/FacebookIcon';
import { TwitterIcon } from '@/shared/components/svgs/TwitterIcon';
import { InstagramIcon } from '@/shared/components/svgs/InstagramIcon';
import Spinner from '@/shared/components/spinner/Spinner';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { useMutation, useQuery } from 'react-query';
import { getUser } from '@/requests/queries/getUser';
import { useFormik } from 'formik';
import { useFirebaseFileUpload } from '@/shared/hooks/useFirebaseFileUpload';
import toast from 'react-hot-toast';
import { updateUser } from '@/requests/mutations/updateUser';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/firebase/config';
import { debounce } from 'lodash';
import { z } from 'zod';
import { WalletAddress } from '@/sections/profile/components/WalletAddress';

const formSchema = z.object({
    firstName: z.string().min(1, 'Field is required'),
    lastName: z.string().min(1, 'Field is required'),
    username: z
        .string()
        .min(3, 'Minimum 3 characters')
        .max(15, 'Maximum 15 characters')
        .regex(/^[a-zA-Z0-9_.-]+$/im, 'Must contain only letters (A-Z, a-z), numbers, _, . or -'),
    phone: z
        .string()
        .min(5, 'Phone cannot be shorter than 5 characters')
        .max(18, 'Maximum 18 characters long allowed')
        .regex(/^[0-9+]+$/im, 'Phone must contain only numbers and/or +'),
    instagram: z.string().max(50, 'Maximum 50 characters allowed'),
    twitter: z.string().max(50, 'Maximum 50 characters allowed'),
    facebook: z.string().max(50, 'Maximum 50 characters allowed'),
    bio: z.string().max(600, 'Maximum 300 characters allowed'),
    profilePicture: z
        .any()
        .refine((value) => value !== null && typeof value === 'object')
        .refine((value) => {
            if (typeof value === 'object' && typeof value?.size === 'number') {
                return value.size < 1024 * 1024 * 2;
            }
            return true;
        }, 'Maximum 2mb allowed')

        .optional(),
    coverPicture: z
        .any()
        .refine((value) => value !== null && typeof value === 'object')
        .refine((value) => {
            if (typeof value === 'object' && typeof value?.size === 'number') {
                return value.size < 1024 * 1024 * 5;
            }
            return true;
        }, 'Maximum 5mb allowed')
        .optional(),
    address_text: z.string().min(1, 'Address is required'),
    lat: z.string().nullish(),
    long: z.string().nullish(),
    placeId: z.string().nullish(),
});

export type UpdateProfileFormValues = z.infer<typeof formSchema>;

export type UpdateProfileFormValuesWithKeys = {
    [Property in keyof UpdateProfileFormValues]: UpdateProfileFormValues[Property];
};

export const EditProfileSection = () => {
    const user = useFirebaseAuth();

    const [initialState, setInitialState] = useState<UpdateProfileFormValues>({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        instagram: '',
        twitter: '',
        facebook: '',
        bio: '',
        address_text: '',
        long: '',
        lat: '',
        placeId: '',
    });

    const [profileImg, setProfileImg] = useState<null | string>('');
    const [coverImg, setCoverImg] = useState<null | string>('');

    const {
        data: firestoreUser,
        refetch,
        isLoading: firestoreInitialLoading,
        isError: firestoreUserInitialError,
        isRefetching: firestoreUserRefetching,
        isRefetchError: firestoreRefetchError,
    } = useQuery({
        queryKey: [`profile-user`, user?.uid ?? ''],
        queryFn: () => getUser(user?.uid as string),
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: !!user && !!user?.uid,
        onSuccess: (user) => {
            setInitialState({
                firstName: user?.firstName ?? '',
                lastName: user?.lastName ?? '',
                username: user?.username ?? '',
                phone: user?.phone ?? '',
                instagram: user?.instagram ?? '',
                twitter: user?.twitter ?? '',
                facebook: user?.facebook ?? '',
                bio: user?.bio ?? '',
                address_text: user?.address_text ?? '',
                long: user?.long ?? '',
                lat: user?.lat ?? '',
                placeId: user?.placeId ?? '',
            });
        },
    });

    const firestoreUserError = firestoreUserInitialError || firestoreRefetchError;
    const firestoreUserLoading = firestoreInitialLoading || firestoreUserRefetching;

    const formik = useFormik<UpdateProfileFormValues>({
        enableReinitialize: true,
        initialValues: initialState,
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
        onSubmit: () => {},
    });

    const {
        initialValues,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        resetForm,
    } = formik;

    const {
        upload: uploadProfile,
        isUploading: profilePictureUploading,
        percentagesStatus: profilePicturePercentageStatus,
    } = useFirebaseFileUpload({
        onSuccess: () => {
            setInitialState((prevState) => {
                return { ...prevState, profilePicture: undefined };
            });
            toast.success('Profile picture uploaded successfully', {
                duration: 4000,
                position: 'bottom-center',
            });
            setFieldValue('profilePicture', undefined);
        },
        onError: () => {
            toast.error('Failed to upload profile picture', {
                duration: 8000,
                position: 'bottom-center',
            });
        },
    });

    const {
        upload: uploadCover,
        isUploading: coverPictueUploading,
        percentagesStatus: coverPercentagesStatus,
    } = useFirebaseFileUpload({
        onSuccess: () => {
            setInitialState((prevState) => {
                return { ...prevState, coverPicture: prevState.coverPicture };
            });
            toast.success('Cover picture uploaded successfully', {
                duration: 4000,
                position: 'bottom-center',
            });
            setFieldValue('coverPicture', undefined);
        },
        onError: () => {
            toast.error('Failed to upload cover picture', {
                duration: 8000,
                position: 'bottom-center',
            });
        },
    });

    const { mutate: mutateUpdateUser, isLoading: updateUserLoading } = useMutation(updateUser, {
        onSuccess: () => {
            const newFormState: UpdateProfileFormValues = {
                facebook: values.facebook,
                twitter: values.twitter,
                instagram: values.instagram,
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                bio: values.bio,
                phone: values.phone,
                address_text: values.address_text,
            };
            setInitialState(newFormState);
            resetForm(newFormState);
            toast.success('Successfully updated the profile', {
                position: 'bottom-center',
                duration: 4000,
            });
        },
        onError: () => {
            toast.error('Failed to update user', {
                position: 'bottom-center',

                duration: 8000,
            });
        },
    });

    const changedItems = useMemo(() => {
        const formValues: UpdateProfileFormValuesWithKeys = formik.values;
        const diffValues: Partial<UpdateProfileFormValuesWithKeys> = {};

        for (const key in formValues) {
            const keyVal = key as keyof UpdateProfileFormValues;
            if (formValues[keyVal] !== initialValues[keyVal]) {
                diffValues[keyVal] = formValues[keyVal];
            }
        }

        return diffValues;
    }, [
        values.facebook,
        values.twitter,
        values.instagram,
        values.username,
        values.firstName,
        values.lastName,
        values.profilePicture,
        values.coverPicture,
        values.bio,
        values.phone,
        values.address_text,
    ]);

    const areChangesValid = useMemo(() => {
        for (const key in changedItems) {
            if (errors[key as keyof UpdateProfileFormValuesWithKeys]) {
                return false;
            }
        }

        return true;
    }, [
        changedItems,
        values.facebook,
        values.twitter,
        values.instagram,
        values.username,
        values.firstName,
        values.lastName,
        values.profilePicture,
        values.coverPicture,
        values.bio,
        values.phone,
        values.address_text,
        errors,
    ]);

    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    async function getUsernameAvailability(username: string) {
        if (doc && db && username) {
            const docRef = doc(db, 'usernames', username);

            const docSnapshot = await getDoc(docRef);

            setIsUsernameAvailable(!docSnapshot.exists());
        }
    }
    const debouncedQueryFn = useCallback(debounce(getUsernameAvailability, 1000), []);

    useEffect(() => {
        debouncedQueryFn(values.username);
    }, [values.username]);

    const handleAutocompleteChange = (data: Partial<PlaceDetails>) => {
        setFieldValue('address_text', data.addressAsString);
        setFieldValue('lat', data?.lat ?? '');
        setFieldValue('long', data?.long ?? '');
        setFieldValue('placeId', data?.placeId ?? '');

        setFieldTouched('address_text', true);

        if (data?.lat) {
            setFieldTouched('lat', true);
        }
        if (data?.long) {
            setFieldTouched('long', true);
        }
        if (data?.placeId) {
            setFieldTouched('placeId', true);
        }
    };

    const handleSubmit = async (e: Event) => {
        // debugger;
        e.preventDefault();

        if (!user?.uid) {
            throw new Error('Missing uid from user');
        }

        if (!firestoreUser) {
            throw new Error('No firestore user found');
        }

        const changedItemsClone: Partial<UpdateProfileFormValuesWithKeys> = { ...changedItems };
        delete changedItemsClone.profilePicture;
        delete changedItemsClone.coverPicture;

        if (Object.keys(changedItemsClone).length > 0) {
            mutateUpdateUser({
                firestoreUser,
                changedItems: changedItemsClone,
                uid: user?.uid,
            });
        }
    };

    const disableInputs = firestoreUserLoading || updateUserLoading || profilePictureUploading || coverPictueUploading;
    const hasChanges = Object.keys(changedItems).length !== 0;

    const bioRef = useRef<HTMLTextAreaElement | null>(null);
    const bioSkeletonHeight = useMemo(() => {
        if (bioRef?.current?.offsetHeight) {
            return bioRef?.current?.offsetHeight;
        }

        return 100;
    }, [bioRef.current]);
    return (
        <>
            {/* <!-- Banner --> */}
            <div className="">
                <div className="banner dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28">
                    <WithInjectedFirebaseImage
                        path={`images/cover/${user?.uid}`}
                        isActive={!!user?.uid}
                        defaultUrl={'https://fakeimg.pl/1200x400/5332fa/f7f7f7?text=COVER&font=bebas'}
                        loadingElement={<Skeleton height={300} background="#676767" />}
                        fetchErrorElement={
                            <div
                                className={
                                    'items-end justify-end text-red-300 flex-col text-right h-[18.75rem] w-full object-cover bg-jacarta-700'
                                }
                            >
                                <span className="flex flex-col items-center justify-center h-full">
                                    <BiSolidErrorCircle className={'text-2xl'} />
                                    <div>Cover image request failure</div>
                                </span>
                            </div>
                        }
                        value={coverImg}
                    >
                        {({ imageUrl }) => {
                            return (
                                <>
                                    <Image
                                        width={1519}
                                        height={300}
                                        priority
                                        src={imageUrl}
                                        alt="banner"
                                        className="h-[18.75rem] w-full object-cover"
                                    />
                                </>
                            );
                        }}
                    </WithInjectedFirebaseImage>

                    <div className="container relative -translate-y-4">
                        <div className="font-display group hover:bg-accent absolute right-0 bottom-4 flex items-center rounded-lg bg-white py-2 px-4 text-sm">
                            <input
                                type="file"
                                name="coverPicture"
                                id="coverPicture"
                                accept="image/*"
                                className="absolute inset-0 cursor-pointer opacity-0"
                                disabled={disableInputs}
                                onChange={(e) => {
                                    setFieldValue('coverPicture', e.target?.files?.[0], true);

                                    if (e.target?.files?.[0]) {
                                        setCoverImg(URL.createObjectURL(e.target?.files?.[0]));
                                    }
                                }}
                            />
                            <PencilEditIcon className="fill-jacarta-400 mr-1 h-4 w-4 group-hover:fill-white" />
                            <span className="text-black mt-0.5 block group-hover:text-white">Edit banner</span>
                        </div>
                    </div>
                    <div className="p-2 text-right">
                        {errors.coverPicture && (
                            <p className="text-red-500 -500 normal-case mt-2">{errors.coverPicture}</p>
                        )}
                    </div>

                    <form className="absolute left-1/2 top-28 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                        <figure className="relative inline-block">
                            <WithInjectedFirebaseImage
                                isActive={!!user?.uid}
                                path={`images/profile/${user?.uid}`}
                                defaultUrl={'https://fakeimg.pl/300x300/fa7532/f7f7f7?text=PROFILE&font=bebas'}
                                loadingElement={
                                    <Skeleton
                                        height={154}
                                        width={154}
                                        background="#676767"
                                        style={{
                                            border: '5px solid white',
                                            borderRadius: 10,
                                        }}
                                    />
                                }
                                fetchErrorElement={
                                    <div
                                        className={
                                            'dark:border-jacarta-600 rounded-xl border-[5px] border-white w-[154px] h-[154px] items-center text-center text-red-300 flex-col'
                                        }
                                    >
                                        <div className="text-center w-full flex justify-center">
                                            <BiSolidErrorCircle className={'text-2xl'} />
                                        </div>
                                        Profile image request failure
                                    </div>
                                }
                                value={profileImg}
                            >
                                {({ imageUrl }) => {
                                    return (
                                        <>
                                            <Image
                                                width={154}
                                                height={154}
                                                priority
                                                src={imageUrl}
                                                alt="banner"
                                                className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
                                            />
                                        </>
                                    );
                                }}
                            </WithInjectedFirebaseImage>

                            <div className="group hover:bg-accent border-jacarta-100 absolute -right-3 -bottom-2 h-8 w-8 overflow-hidden rounded-full border bg-white text-center hover:border-transparent">
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="profilePicture"
                                    id="profilePicture"
                                    disabled={disableInputs}
                                    onChange={(e) => {
                                        setFieldValue('profilePicture', e.target?.files?.[0], true);

                                        if (e.target?.files?.[0]) {
                                            setProfileImg(URL.createObjectURL(e.target?.files?.[0]));
                                        }
                                    }}
                                    className="absolute top-0 left-0 w-full cursor-pointer opacity-0"
                                />
                                <div className="flex h-full items-center justify-center">
                                    <PencilEditIcon className="fill-jacarta-400 h-4 w-4 group-hover:fill-white" />
                                </div>
                            </div>

                            <div className="absolute top-0 right-[-8.5rem] sm:right-[-10.5rem] md:right-[-15.5rem]">
                                <p className="dark:text-jacarta-300 text-xs w-full max-w-[8rem] leading-[1.25] sm:max-w-[10rem] md:max-w-[15rem] lg:leading-5">
                                    We recommend an image of at least 300x300. Gifs work too. Max 5mb.
                                </p>
                                {errors.profilePicture && (
                                    <p className="text-red-500 -500 normal-case mt-2">{errors.profilePicture}</p>
                                )}
                            </div>
                        </figure>
                    </form>
                </div>
            </div>
            {firestoreUserError && (
                <div className={'h-[700px] flex items-center justify-center text-xl'}>
                    <div>
                        <div className="flex">
                            A loading error has occured <PiWarningOctagon className="ml-2 fill-amber-400" />
                        </div>

                        <div className="flex">
                            Press{' '}
                            <span className="text-accent mx-1 hover:unerline cursor-pointer" onClick={() => refetch()}>
                                here
                            </span>{' '}
                            to try again
                        </div>
                    </div>
                </div>
            )}
            {!firestoreUserError && (
                <section className={classNames(`dark:bg-jacarta-800 relative py-16`)}>
                    <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
                        <Image
                            width={1519}
                            height={773}
                            priority
                            src="/images/gradient_light.jpg"
                            alt="gradient"
                            className="h-full w-full object-cover"
                        />
                    </picture>
                    <div className="container">
                        <div className="mx-auto flex">
                            <div className="mb-12 w-full flex flex-wrap">
                                <div className="w-full px-2">
                                    <label
                                        htmlFor="bio"
                                        className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white"
                                    >
                                        {firestoreUserLoading && (
                                            <Skeleton background="#676767" style={{ width: '25%' }} />
                                        )}

                                        {!firestoreUserLoading && <>Bio</>}
                                    </label>
                                    {firestoreUserLoading && (
                                        <Skeleton background="#676767" height={bioSkeletonHeight} />
                                    )}
                                    <textarea
                                        ref={bioRef}
                                        id="bio"
                                        name="bio"
                                        value={values.bio}
                                        disabled={disableInputs}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={classNames(
                                            'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white',
                                            {
                                                hidden: firestoreUserLoading,
                                            }
                                        )}
                                        placeholder="Write something about you..."
                                        rows={6}
                                    ></textarea>
                                    {touched.bio && errors.bio && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.bio}</p>
                                    )}
                                </div>
                                <div className="bg-blue-200 p-2 w-full lg:w-1/2">
                                    <div className="">
                                        <label
                                            htmlFor="firstName"
                                            className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white"
                                        >
                                            {firestoreUserLoading && (
                                                <Skeleton background="#676767" style={{ width: '50%' }} />
                                            )}

                                            {!firestoreUserLoading && (
                                                <>
                                                    First Name
                                                    <span className="text-red-500 ">*</span>
                                                </>
                                            )}
                                        </label>
                                        {firestoreUserLoading && <Skeleton background="#676767" height={50} />}
                                        <input
                                            type="text"
                                            id="firstName"
                                            disabled={disableInputs}
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            placeholder="Your first name"
                                        />
                                    </div>
                                    {touched.firstName && errors.firstName && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.firstName}</p>
                                    )}
                                </div>
                                <div className="bg-blue-300 p-2 w-full lg:w-1/2 relative">
                                    <div className="">
                                        <label
                                            htmlFor="lastName"
                                            className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white"
                                        >
                                            {firestoreUserLoading && (
                                                <Skeleton background="#676767" style={{ width: '50%' }} />
                                            )}

                                            {!firestoreUserLoading && (
                                                <>
                                                    Last Name
                                                    <span className="text-red-500 ">*</span>
                                                </>
                                            )}
                                        </label>

                                        {firestoreUserLoading && <Skeleton background="#676767" height={50} />}

                                        <input
                                            type="text"
                                            id="lastName"
                                            disabled={disableInputs}
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            placeholder="Your last name"
                                        />
                                    </div>
                                    {touched.lastName && errors.lastName && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.lastName}</p>
                                    )}
                                </div>
                                <div className="bg-blue-200 p-2 w-full lg:w-1/2">
                                    <div className="">
                                        <label className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white">
                                            {firestoreUserLoading && (
                                                <Skeleton background="#676767" style={{ width: '50%' }} />
                                            )}

                                            {!firestoreUserLoading && <>Public Key</>}
                                        </label>

                                        {firestoreUserLoading && <Skeleton background="#676767" height={50} />}

                                        <WalletAddress
                                            classes={classNames(
                                                'js-copy-clipboard dark:bg-jacarta-700 border-jacarta-100 hover:bg-jacarta-50 dark:border-jacarta-600 dark:text-jacarta-300 flex w-full select-none items-center rounded-lg border bg-white py-3 px-4',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            walletAddress={firestoreUser?.pubkey}
                                        />
                                    </div>
                                </div>
                                <div className="bg-blue-200 p-2 w-full lg:w-1/2">
                                    <div className="">
                                        <label className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white">
                                            {firestoreUserLoading && (
                                                <Skeleton background="#676767" style={{ width: '50%' }} />
                                            )}

                                            {!firestoreUserLoading && <>Email</>}
                                        </label>
                                        {firestoreUserLoading && <Skeleton background="#676767" height={50} />}
                                        <input
                                            disabled
                                            type="text"
                                            id="email"
                                            value={user?.email ?? ''}
                                            className={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:bg-jacarta-50 dark:border-jacarta-600 dark:text-jacarta-300 flex w-full select-none items-center rounded-lg border bg-white py-3 px-4',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            placeholder="Your first name"
                                        />
                                    </div>
                                    {touched.firstName && errors.firstName && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.firstName}</p>
                                    )}
                                </div>
                                <div className="bg-blue-300 p-2 w-full lg:w-1/2">
                                    <div className="">
                                        <label
                                            htmlFor="username"
                                            className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white"
                                        >
                                            {firestoreUserLoading && (
                                                <Skeleton background="#676767" style={{ width: '50%' }} />
                                            )}

                                            {!firestoreUserLoading && (
                                                <>
                                                    Username
                                                    <span className="text-red-500 ">*</span>
                                                </>
                                            )}
                                        </label>
                                        {firestoreUserLoading && <Skeleton background="#676767" height={50} />}
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            disabled={disableInputs}
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            placeholder="Your username"
                                        />
                                        {changedItems.username && touched.username && !errors.username ? (
                                            <div>
                                                {/*{fieldsToUpdate.username ? (*/}
                                                {isUsernameAvailable ? (
                                                    <div className="text-green">Available</div>
                                                ) : (
                                                    <div className="text-red-500 ">Not available</div>
                                                )}
                                                {/*) : null}*/}
                                            </div>
                                        ) : (
                                            <p className="text-red-500 -500 normal-case mt-2">{errors.username}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-blue-600 p-2 w-full lg:w-1/2">
                                    <div className="">
                                        <label
                                            htmlFor="phone"
                                            className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white"
                                        >
                                            {firestoreUserLoading && (
                                                <Skeleton background="#676767" style={{ width: '50%' }} />
                                            )}

                                            {!firestoreUserLoading && (
                                                <>
                                                    Phone Number
                                                    <span className="text-red-500 ">*</span>
                                                </>
                                            )}
                                        </label>
                                        {firestoreUserLoading && <Skeleton background="#676767" height={50} />}
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            disabled={disableInputs}
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            placeholder="Your phone number"
                                        />
                                        {touched.phone && errors.phone && (
                                            <p className="text-red-500 -500 normal-case mt-2">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-blue-600 p-2 w-full">
                                    <div className="">
                                        <label className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white">
                                            {firestoreUserLoading && (
                                                <Skeleton background="#676767" style={{ width: '50%' }} />
                                            )}

                                            {!firestoreUserLoading && (
                                                <>
                                                    Address
                                                    <span className="text-red-500 ">*</span>
                                                </>
                                            )}
                                        </label>
                                        {firestoreUserLoading && <Skeleton background="#676767" height={50} />}
                                        <AutocompleteAddress
                                            disabled={disableInputs}
                                            inputClassName={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            onChange={handleAutocompleteChange}
                                            placeholder={'Type in your address and select from the list'}
                                            initialValue={initialState.address_text}
                                        />
                                        {touched.address_text && errors.address_text && (
                                            <p className="text-red-500 -500 normal-case mt-2">{errors.address_text}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full px-2">
                                    <label className="font-display text-jacarta-700 mb-2 block text-sm dark:text-white">
                                        {firestoreUserLoading && (
                                            <Skeleton background="#676767" style={{ width: '25%' }} />
                                        )}

                                        {!firestoreUserLoading && (
                                            <>
                                                Social Media
                                                <span className="text-red-500 ">*</span>
                                            </>
                                        )}
                                    </label>

                                    <div className="relative">
                                        {firestoreUserLoading && (
                                            <Skeleton background="#676767" height={50} style={{ margin: '0.5em 0' }} />
                                        )}
                                        {!firestoreUserLoading && (
                                            <FacebookIcon className="fill-jacarta-300 dark:fill-jacarta-400 pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                                        )}

                                        <input
                                            type="text"
                                            id="facebook"
                                            name="facebook"
                                            disabled={disableInputs}
                                            value={values.facebook}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full py-3 pl-10 hover:ring-2 focus:ring-inset dark:text-white',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            placeholder={'Facebook URL'}
                                        />
                                    </div>
                                    {touched.facebook && errors.facebook && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.facebook}</p>
                                    )}

                                    <div className="relative">
                                        {firestoreUserLoading && (
                                            <Skeleton background="#676767" height={50} style={{ margin: '0.5em 0' }} />
                                        )}
                                        {!firestoreUserLoading && (
                                            <TwitterIcon className="fill-jacarta-300 dark:fill-jacarta-400 pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                                        )}

                                        <input
                                            type="text"
                                            id="twitter"
                                            name="twitter"
                                            disabled={disableInputs}
                                            value={values.twitter}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full py-3 pl-10 hover:ring-2 focus:ring-inset dark:text-white',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            placeholder={'Twitter URL'}
                                        />
                                    </div>
                                    {touched.twitter && errors.twitter && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.twitter}</p>
                                    )}

                                    <div className="relative">
                                        {firestoreUserLoading && (
                                            <Skeleton background="#676767" height={50} style={{ margin: '0.5em 0' }} />
                                        )}
                                        {!firestoreUserLoading && (
                                            <InstagramIcon className="fill-jacarta-300 dark:fill-jacarta-400 pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                                        )}

                                        <input
                                            type="text"
                                            id="instagram"
                                            name="instagram"
                                            disabled={disableInputs}
                                            value={values.instagram}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={classNames(
                                                'dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full py-3 pl-10 hover:ring-2 focus:ring-inset dark:text-white',
                                                {
                                                    hidden: firestoreUserLoading,
                                                }
                                            )}
                                            placeholder={'Instagram URL'}
                                        />
                                    </div>
                                    {touched.instagram && errors.instagram && (
                                        <p className="text-red-500 -500 normal-case mt-2">{errors.instagram}</p>
                                    )}
                                </div>

                                <button
                                    disabled={disableInputs}
                                    onClick={(e) => {
                                        if (!disableInputs && hasChanges && areChangesValid) {
                                            handleSubmit(e);

                                            if (changedItems.profilePicture) {
                                                uploadProfile(`images/profile/${user?.uid}`, values.profilePicture);
                                            }

                                            if (changedItems.coverPicture) {
                                                uploadCover(`images/cover/${user?.uid}`, values.coverPicture);
                                            }
                                        }
                                    }}
                                    className={classNames(
                                        'ml-2 mt-4 bg-accent rounded-full py-3 px-8 text-center font-semibold text-white transition-all flex',
                                        {
                                            hidden: firestoreUserLoading,
                                            'bg-jacarta-500': disableInputs || !hasChanges || !areChangesValid,
                                            'shadow-accent-volume hover:bg-accent-dark':
                                                !disableInputs && hasChanges && areChangesValid,
                                        }
                                    )}
                                >
                                    {updateUserLoading || coverPictueUploading || profilePictureUploading ? (
                                        <>
                                            <span className="mr-2">Saving changes</span>
                                            <Spinner />
                                        </>
                                    ) : (
                                        'Update Profile'
                                    )}
                                </button>
                            </div>
                        </div>
                        {profilePictureUploading ? (
                            <div className="p-2 dark:text-white">
                                Uploading profile picture ({profilePicturePercentageStatus?.toFixed(0)}%)
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500 bg-accent"
                                        style={{ width: `${profilePicturePercentageStatus?.toFixed(0)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : null}
                        {coverPictueUploading ? (
                            <div className="p-2 dark:text-white">
                                Uploading cover picture ({coverPercentagesStatus?.toFixed(0)}%)
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500 bg-accent"
                                        style={{ width: `${coverPercentagesStatus?.toFixed(0)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </section>
            )}
        </>
    );
};
