import { getAhListing } from '@/requests/queries/getAhListing';
import { useMutation, useQuery } from 'react-query';
import type { DAS } from 'helius-sdk';
import toast from 'react-hot-toast';
import { CloseIcon } from '@/shared/components/svgs/CloseIcon';
import React from 'react';
import Skeleton from 'tiny-skeleton-loader-react';
import SolanaIcon from '@/shared/components/svgs/SolanaIcon';
import moment from 'moment';
import { postCancelTransaction } from '@/requests/mutations/postCancelTransaction';
import Spinner from '@/shared/components/spinner/Spinner';
import { useMetaplex } from '@/shared/hooks/useMetaplex';
import { SellMutationArgs, postSellTransaction } from '@/requests/mutations/postSellTransaction';
import { postBuyTransaction } from '@/requests/mutations/postBuyTransaction';
import { Dropdown } from '@/shared/components/dropdown/Dropdown';
import { ahCategoriesOptions } from '@/sections/item/config';
import { z } from 'zod';
import { useFormik } from 'formik';
import { getSolPrice } from '@/requests/queries/getSolPrice';

type AuctionHouseActionsSection = {
    nftInfo: DAS.GetAssetResponse;
    userWalletAddress: string;
};

const listNftFormSchema = z.object({
    price: z
        .string()
        .refine((price) => {
            const priceAsNum = Number(price);
            // if you change the price here, also change it in the sell firebase function
            return priceAsNum >= 0.01;
        }, 'Price must be a number and at least 0.01')
        .refine((price) => {
            const priceAsNum = Number(price);
            return !isNaN(priceAsNum);
        }, 'Price must be a number and at least 0.01'),
    category: z.string().min(1, 'Category required'),
    // type: z.enum(['physical', 'digital']),
    // heightInCm: z.number().min(1, 'Height in cm required'),
    // widthInCm: z.number().min(1, 'Width in cm required'),
    // lengthInCm: z.number().min(1, 'Length in cm required'),
    // weightInKg: z.number().min(0.01, 'Weight in kg required'),
});
// .refine((values) => {
//     if (values.type === 'physical') {
//         return values.heightInCm && values.widthInCm && values.lengthInCm && values.weightInKg;
//     }
//     return true;
// });

export type ListNftForm = z.infer<typeof listNftFormSchema>;

export function AuctionHouseActionsSection({ nftInfo, userWalletAddress }: AuctionHouseActionsSection) {
    const { metaplex } = useMetaplex();

    const { data: solPrice } = useQuery({
        queryKey: ['sol-price'],
        queryFn: () => getSolPrice(),
        cacheTime: 1000 * 60,
    });

    const {
        data: ahItemsRes,
        isSuccess,
        isFetching: isLoading,
        refetch,
    } = useQuery({
        queryKey: ['ah-items', nftInfo.id],
        queryFn: () => getAhListing(nftInfo.id),
        staleTime: 0,
        enabled: !!nftInfo.id,
        onError: () => {
            const toastId = toast.error(
                <div>
                    <div>Failed to load auction house information</div>
                    <div>
                        Click{' '}
                        <span onClick={() => refetch()} className="text-accent hover:underline cursor-pointer">
                            here
                        </span>{' '}
                        to try again
                    </div>
                    <div onClick={() => toast.dismiss(toastId)}>
                        <CloseIcon />
                    </div>
                </div>,
                {
                    duration: 999999,
                    position: 'bottom-center',
                }
            );
            console.log({ toastId });
        },
    });

    const listedAhItems = ahItemsRes?.filter((listing) => !listing.hasSold);

    const {
        mutate: cancelMutate,
        isSuccess: cancelMutateSucess,
        isLoading: cancelMutateLoading,
        isError: cancelMutateError,
    } = useMutation(postCancelTransaction, {
        onError: () => {
            const toastId = toast.error(
                <div>
                    <div>Failed to cancel the listing</div>
                    <div onClick={() => toast.dismiss(toastId)}>
                        <CloseIcon />
                    </div>
                </div>,
                {
                    duration: 999999,
                    position: 'bottom-center',
                }
            );
        },
    });

    const {
        mutate: sellMutate,
        isSuccess: sellMutateSuccess,
        isLoading: sellMutateLoading,
        isError: sellMutateError,
    } = useMutation(postSellTransaction, {
        onError: () => {
            const toastId = toast.error(
                <div>
                    <div>Failed to put the item in listing</div>
                    <div onClick={() => toast.dismiss(toastId)}>
                        <CloseIcon />
                    </div>
                </div>,
                {
                    duration: 999999,
                    position: 'bottom-center',
                }
            );
            console.log({ toastId });
        },
    });

    const {
        mutate: buyMutation,
        isSuccess: buySuccess,
        isLoading: buyLoading,
        isError: buyError,
    } = useMutation(postBuyTransaction, {
        onError: () => {
            const toastId = toast.error(
                <div>
                    <div>Failed to purchase the asset</div>
                    <div onClick={() => toast.dismiss(toastId)}>
                        <CloseIcon />
                    </div>
                </div>,
                {
                    duration: 999999,
                    position: 'bottom-center',
                }
            );
        },
    });

    const formik = useFormik<ListNftForm>({
        enableReinitialize: true,
        initialValues: {
            price: '',
            category: '',
            // type: 'digital',
            // heightInCm: 0,
            // widthInCm: 0,
            // lengthInCm: 0,
            // weightInKg: 0,
        },
        validate: (values) => {
            const result = listNftFormSchema.safeParse(values);
            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                type FieldErrors = typeof fieldErrors & { [key: string]: string };
                for (const key in fieldErrors as FieldErrors) {
                    (fieldErrors as FieldErrors)[key] = (fieldErrors as FieldErrors)[key][0];
                }
                return fieldErrors;
            }
        },
        onSubmit: () => {
            const selectedCategory = ahCategoriesOptions?.find((option) => option.id == values.category)?.label;
            if (metaplex && selectedCategory) {
                const mutatedValues: SellMutationArgs = {
                    mintAddress: nftInfo.id,
                    price: Number(values.price) as number,
                    metaplex: metaplex,
                    category: selectedCategory,
                };
                // if (values.type === 'physical') {
                //     mutatedValues.physicalObjectDetails = {
                //         height: values.heightInCm,
                //         width: values.widthInCm,
                //         length: values.lengthInCm,
                //         weight: values.weightInKg,
                //     };
                // }

                sellMutate(mutatedValues);
            }
        },
    });

    const { values, errors, touched, handleBlur, setFieldValue, submitForm } = formik;

    console.log({ errors });
    const foundAhItem = listedAhItems?.find((item) => item);
    const isByOwner = foundAhItem?.seller === userWalletAddress;

    const shouldShowCancelOption =
        isSuccess &&
        !isLoading &&
        isByOwner &&
        listedAhItems?.length === 1 &&
        !foundAhItem.hasSold &&
        !foundAhItem.isCanceled;
    const shouldShowListingOption =
        isSuccess && !isLoading && userWalletAddress === nftInfo.ownership.owner && listedAhItems?.length === 0;

    const shouldShowTheBuyOption =
        isSuccess &&
        !isByOwner &&
        !isLoading &&
        !foundAhItem?.hasSold &&
        !foundAhItem?.isCanceled &&
        listedAhItems?.length === 1;

    const price = (foundAhItem?.price ?? 1) / Math.pow(10, 9);

    const formattedDate = moment(foundAhItem?.listedAt ?? '').format('DD MMM YYYY');

    const yourCut = parseFloat((Number(values.price) * 0.8).toFixed(6));
    const yourCutInEur = parseFloat(((solPrice?.solana?.eur ?? 1) * yourCut).toFixed(3));
    const yourCutInUsd = parseFloat(((solPrice?.solana?.usd ?? 1) * yourCut).toFixed(3));
    const ahCut = parseFloat((Number(values.price) * 0.2).toFixed(6));

    return (
        <>
            {isLoading && <Skeleton width={300} height={200} background="#676767" />}
            {!isLoading && metaplex && (
                <div className="dark:bg-jacarta-700 dark:text-white dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-4">
                    {cancelMutateSucess && (
                        <div className="my-4 flex items-center flex-wrap">
                            Successfully cancelled the listing, it might take a few minutes for the changes to take
                            effect
                        </div>
                    )}
                    <div>
                        {shouldShowCancelOption && !cancelMutateSucess && (
                            <>
                                <div className="my-4 flex items-center flex-wrap dark:text-white">
                                    Item currently on sale since{' '}
                                    <span className="text-jacarta-400 px-1">{formattedDate}</span> for{' '}
                                    <div className="w-full flex gap-1 items-center">
                                        {price} SOL <SolanaIcon width={20} height={20} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (foundAhItem.id && metaplex) {
                                            cancelMutate({
                                                receiptAddress: foundAhItem.id,
                                                metaplex: metaplex,
                                            });
                                        }
                                    }}
                                    className="bg-accent shadow-accent-volume hover:bg-accent-dark w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {cancelMutateLoading && !cancelMutateError && <Spinner />}
                                    {cancelMutateLoading && !cancelMutateError && 'Cancelling'}
                                    {!cancelMutateLoading && 'Cancel item'}
                                    {/*BUY for {ahListing.price / Math.pow(10, 9)} SOL*/}
                                </button>
                            </>
                        )}
                    </div>

                    {sellMutateSuccess && (
                        <div className="my-4 flex items-center flex-wrap">
                            Successfully put the item on list, it might take a few minutes for the changes to take
                            effect
                        </div>
                    )}
                    <div className="dark:text-white">
                        {shouldShowListingOption && !sellMutateSuccess && (
                            <>
                                <div className="my-4 flex items-center flex-wrap">
                                    The item is not listed for sale, if you wish to put it on the auction house, please
                                    select a price and a category
                                </div>
                                <div className="grid grid-cols-2 mb-4 pb-2 border-b border-jacarta-600 ">
                                    <div>
                                        <div className="border-b border-jacarta-600 py-2 mb-2">You receive:</div>

                                        <div>
                                            SOL <span className="text-yellow-400">{yourCut}</span>
                                        </div>
                                        <div>
                                            €~ <span className="text-yellow-400">{yourCutInEur}</span>
                                        </div>
                                        <div>
                                            $~ <span className="text-yellow-400">{yourCutInUsd}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="border-b border-jacarta-600 py-2 mb-2">A-NFT receives:</div>

                                        <div>
                                            SOL <span className="text-yellow-400">{ahCut}</span>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    value={values.price ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        console.log({ val });
                                        const onlyNumberAndDot = val.replace(/[^\d.]/g, '');
                                        setFieldValue('price', onlyNumberAndDot, true);
                                    }}
                                    onBlur={handleBlur}
                                    type="text"
                                    id="price"
                                    name={'price'}
                                    className="mb-2 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                                    placeholder="Selling price"
                                    required
                                />
                                {touched.price && errors.price && (
                                    <p className="text-red-500 normal-case mb-2">{errors.price}</p>
                                )}
                                <Dropdown
                                    options={ahCategoriesOptions}
                                    onChange={(option) => {
                                        setFieldValue('category', option.id);
                                    }}
                                    selectedItem={
                                        ahCategoriesOptions?.find((option) => option.id == values.category) ?? null
                                    }
                                    noSelectionLabel={'Please select a category'}
                                />
                                {touched.category && errors.category && (
                                    <p className="text-red-500 normal-case mb-2">{errors.category}</p>
                                )}

                                {/*<div className="mb-6 mt-6">*/}
                                {/*    <label*/}
                                {/*        htmlFor="Type of art"*/}
                                {/*        className="font-display text-jacarta-700 mb-2 block dark:text-white"*/}
                                {/*    >*/}
                                {/*        Type of art<span className="text-red-500 ">*</span>*/}
                                {/*    </label>*/}
                                {/*    <div className="flex space-x-4">*/}
                                {/*        <button*/}
                                {/*            className={classNames(*/}
                                {/*                'group bg-jacarta-700 border-accent flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border',*/}
                                {/*                values.type === 'digital' ? 'dark:bg-accent/50' : ''*/}
                                {/*            )}*/}
                                {/*            onClick={() => {*/}
                                {/*                setFieldValue('type', 'digital', true);*/}
                                {/*                setFieldTouched('type', true);*/}
                                {/*            }}*/}
                                {/*        >*/}
                                {/*            Digital*/}
                                {/*        </button>*/}
                                {/*        <button*/}
                                {/*            className={classNames(*/}
                                {/*                'group bg-jacarta-700 border-accent flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border',*/}
                                {/*                values.type === 'physical' ? 'dark:bg-accent/50' : ''*/}
                                {/*            )}*/}
                                {/*            onClick={() => {*/}
                                {/*                setFieldValue('type', 'physical', true);*/}
                                {/*                setFieldTouched('type', true);*/}
                                {/*            }}*/}
                                {/*        >*/}
                                {/*            Physical*/}
                                {/*        </button>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/*{values.type === 'physical' && (*/}
                                {/*    <div className="grid grid-cols-auto-fit-200 gap-x-4">*/}
                                {/*        <div>*/}
                                {/*            <label htmlFor="heightInCm">Height (cm)</label>*/}
                                {/*            <input*/}
                                {/*                value={String(values.heightInCm ?? '')}*/}
                                {/*                onChange={(e) => {*/}
                                {/*                    setFieldValue('heightInCm', Number(e.target.value));*/}
                                {/*                }}*/}
                                {/*                onBlur={handleBlur}*/}
                                {/*                type="text"*/}
                                {/*                id="heightInCm"*/}
                                {/*                name={'heightInCm'}*/}
                                {/*                className="mb-2 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"*/}
                                {/*                placeholder="Height in cm"*/}
                                {/*                required*/}
                                {/*            />*/}
                                {/*            {touched.heightInCm && errors.heightInCm && (*/}
                                {/*                <p className="text-red-500 normal-case mb-2">{errors.heightInCm}</p>*/}
                                {/*            )}*/}
                                {/*        </div>*/}
                                {/*        <div>*/}
                                {/*            <label htmlFor="widthInCm">Width (cm)</label>*/}
                                {/*            <input*/}
                                {/*                value={String(values.widthInCm ?? '')}*/}
                                {/*                onChange={(e) => {*/}
                                {/*                    setFieldValue('widthInCm', Number(e.target.value));*/}
                                {/*                }}*/}
                                {/*                onBlur={handleBlur}*/}
                                {/*                type="text"*/}
                                {/*                id="widthInCm"*/}
                                {/*                name={'widthInCm'}*/}
                                {/*                className="mb-2 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"*/}
                                {/*                placeholder="Width in cm"*/}
                                {/*                required*/}
                                {/*            />*/}
                                {/*            {touched.widthInCm && errors.widthInCm && (*/}
                                {/*                <p className="text-red-500 normal-case mb-2">{errors.widthInCm}</p>*/}
                                {/*            )}*/}
                                {/*        </div>*/}
                                {/*        <div>*/}
                                {/*            <label htmlFor="length">Length (cm)</label>*/}
                                {/*            <input*/}
                                {/*                value={String(values.lengthInCm ?? '')}*/}
                                {/*                onChange={(e) => {*/}
                                {/*                    setFieldValue('lengthInCm', Number(e.target.value));*/}
                                {/*                }}*/}
                                {/*                onBlur={handleBlur}*/}
                                {/*                type="text"*/}
                                {/*                id="lengthInCm"*/}
                                {/*                name={'lengthInCm'}*/}
                                {/*                className="mb-2 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"*/}
                                {/*                placeholder="Length in cm"*/}
                                {/*                required*/}
                                {/*            />*/}
                                {/*            {touched.lengthInCm && errors.lengthInCm && (*/}
                                {/*                <p className="text-red-500 normal-case mb-2">{errors.lengthInCm}</p>*/}
                                {/*            )}*/}
                                {/*        </div>*/}
                                {/*        <div>*/}
                                {/*            <label htmlFor="">Weight (kg)</label>*/}
                                {/*            <input*/}
                                {/*                value={String(values.weightInKg ?? '')}*/}
                                {/*                onChange={(e) => {*/}
                                {/*                    setFieldValue('weightInKg', Number(e.target.value));*/}
                                {/*                }}*/}
                                {/*                onBlur={handleBlur}*/}
                                {/*                type="text"*/}
                                {/*                id="weightInKg"*/}
                                {/*                name={'weightInKg'}*/}
                                {/*                className="mb-2 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"*/}
                                {/*                placeholder="Weight in kg"*/}
                                {/*                required*/}
                                {/*            />*/}
                                {/*            {touched.weightInKg && errors.weightInKg && (*/}
                                {/*                <p className="text-red-500 normal-case mb-2">{errors.weightInKg}</p>*/}
                                {/*            )}*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                <button
                                    onClick={() => {
                                        submitForm();
                                    }}
                                    className="mt-4 bg-accent shadow-accent-volume hover:bg-accent-dark w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {sellMutateLoading && !sellMutateError && <Spinner />}
                                    {sellMutateLoading && !sellMutateError && 'Listing'}
                                    {!sellMutateLoading && 'List for sale'}
                                </button>
                            </>
                        )}
                    </div>
                    <div>
                        {buySuccess && (
                            <div className="my-4 flex items-center flex-wrap">
                                Successfully purchased the asset for {price} SOL, please wait a few minutes for the item
                                to appear in your inventory
                            </div>
                        )}
                        <div>
                            {shouldShowTheBuyOption && !buySuccess && (
                                <>
                                    <div className="my-4 flex items-center flex-wrap">
                                        Item currently on sale since{' '}
                                        <span className="text-jacarta-400 px-1">{formattedDate}</span> for{' '}
                                        <div className="w-full flex gap-1 items-center">
                                            {price} SOL <SolanaIcon width={20} height={20} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (foundAhItem?.id && metaplex) {
                                                buyMutation({
                                                    receiptAddress: foundAhItem.id,
                                                    metaplex: metaplex,
                                                });
                                            }
                                        }}
                                        className="bg-accent shadow-accent-volume hover:bg-accent-dark w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        {buyLoading && !buyError && <Spinner />}
                                        {buyLoading && !buyError && 'Buying'}
                                        {!buyLoading && 'Buy item'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
