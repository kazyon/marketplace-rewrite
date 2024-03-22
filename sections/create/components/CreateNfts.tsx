import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';
import { useQuery } from 'react-query';
import { CreateNFTParams, useNFTs } from '@/shared/hooks/useNfts';
import { useMetaplex } from '@/shared/hooks/useMetaplex';
import { getAllNfts, NftWithCollectionStatus } from '@/requests/queries/getAllNfts';
import { CreateCompressedNftOutput } from '@metaplex-foundation/js';
import { AttributesIcon } from '@/shared/components/svgs/AttributesIcon';
import SelectCollectionDropdown from '@/sections/create/components/SelectCollectionDropdown';
import NftCreatingOverlay from '@/sections/create/components/NftCreatingOverlay';
import Skeleton from 'tiny-skeleton-loader-react';
import { PlusIcon } from '@/shared/components/svgs/PlusIcon';
import { CloseIcon } from '@/shared/components/svgs/CloseIcon';
import { InfoIcon } from '@/shared/components/svgs/InfoIcon';
import { NftAssetPreviewer } from '@/sections/create/components/NftAssetPreviewer';
import { z } from 'zod';
import { toFormikValidate } from '@/utils/toFormikValidate';
import { getCollectionsByPubkey } from '@/requests/queries/getCollectionsByPubkey';
import { mainNftAssetAcceptableExtensions, nftAcceptableImageExtensions } from '@/sections/create/config';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

const popupItemData = [
    {
        id: 1,
        name: 'Attribute',
        text: 'Set any other additional data about the NFT in here.',
        icon: <AttributesIcon className="icon fill-jacarta-700 mr-2 mt-px h-4 w-4 shrink-0 dark:fill-white" />,
    },
];

const CreateNfts = () => {
    const formSchemaRef = useRef(
        z
            .object({
                name: z
                    .string()
                    .min(1, 'Name is required')
                    .refine((name) => {
                        // need the length in bytes to account for characters which are longer than a byes, for example emojis😄
                        // as per the NFT standard the max name is 32 bytes long
                        const bytes = new TextEncoder().encode(name).length;

                        return bytes < 32;
                    }, 'Name is too long'),
                description: z.string().min(1, 'Description is required'), // TODO: while not having an explicit max length (since it's stored on the metadata JSON, it would be ideal to also include a sensible max length here)
                isCollection: z.boolean(),
                previewImage: z
                    .instanceof(File, {
                        message: 'Preview image is required',
                    })
                    .nullish(),
                mainFile: z
                    .instanceof(File, {
                        message: 'Asset file is required',
                    })
                    .nullable()
                    .refine((val) => val, 'Please select a file'),
                attributes: z.array(
                    z.object({
                        trait_type: z.string().min(1, 'Trait type is required'),
                        value: z.string().min(1, 'Value is required'),
                    })
                ),
                selectedCollection: z.string().nullish(),
            })
            .refine(
                (values) => {
                    if (values.isCollection) {
                        return values.selectedCollection;
                    }

                    return true;
                },
                { path: ['selectedCollection'], message: 'Please select a collection' }
            )
            .refine(
                (values) => {
                    if (values?.mainFile?.type?.startsWith('image/')) {
                        return true;
                    }

                    return values.previewImage instanceof File;
                },
                { path: ['previewImage'], message: 'Preview image is required' }
            )
    );
    const { createdNftStep, createSingleNFT, createNFTAndAddToCollection } = useNFTs();
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [nftCreatedSuccessfully, setNftCreatedSuccessfully] = useState(false);
    const [createdNft, setCreatedNft] = useState<CreateCompressedNftOutput | undefined>();
    const { metaplex } = useMetaplex();
    const wallet = useWallet();

    const publicKey = metaplex?.identity().publicKey.toString();

    console.log({ mIdentity: metaplex?.identity().publicKey, walletIde: wallet?.publicKey?.toString() });

    const {
        data: nfts,
        isLoading: nftsLoading,
        isError: nftLoadingError,
        refetch: nftRefetch,
        isRefetching: nftsRefetching,
    } = useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['nfts', publicKey],
        queryFn: () => getAllNfts(publicKey),
        staleTime: 0,
        enabled: !!publicKey,
        retry: (count) => count < 2,
    });

    const {
        data: collectionsList,
        isLoading: collectionsListLoading,
        isError: collectionsListError,
        refetch: collectionsListRefetch,
        isRefetching: collectionsListRefetching,
    } = useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['collections', publicKey],
        queryFn: () => getCollectionsByPubkey(publicKey as string),
        staleTime: 0,
        enabled: !!publicKey,
    });

    const collections = useMemo(() => {
        if (nfts && collectionsList) {
            const uniqueElementsSet = new Set();
            const apiCollections = nfts
                .filter((nft) => nft.isCollection)
                .map((item) => item.id)
                .map((item) => item);
            apiCollections.forEach((item) => uniqueElementsSet.add(item));
            collectionsList.forEach((item) => uniqueElementsSet.add(item));

            return nfts.filter((item) => uniqueElementsSet.has(item.id));
        }

        return null;
    }, [nfts]);

    const formik = useFormik<z.infer<typeof formSchemaRef.current>>({
        initialValues: {
            name: '',
            description: '',
            previewImage: null,
            mainFile: null,
            isCollection: false,
            selectedCollection: '',
            attributes: [],
        },
        validate: toFormikValidate(formSchemaRef.current),

        enableReinitialize: true,

        onSubmit: (formValues) => {
            const createNft = async () => {
                if (!formValues.mainFile) {
                    throw new Error('File is required');
                }

                setIsCreating(true);
                setCreateError('');
                try {
                    const data: CreateNFTParams = {
                        secondaryImageAsset: formValues.previewImage,
                        mainFile: formValues.mainFile,
                        metadata: {
                            name: formValues.name,
                            description: formValues.description,
                            sellerFeeBasis: 0,
                            symbol: '',
                        },
                    };

                    if (formValues.attributes && formValues.attributes.length > 0) {
                        data.metadata.attributes = formValues.attributes;
                    }

                    let createdNFT: CreateCompressedNftOutput | undefined;

                    if (formValues.isCollection) {
                        if (!formValues.selectedCollection) {
                            throw new Error('No selected collection');
                        }
                        createdNFT = await createNFTAndAddToCollection({
                            ...data,
                            collectionPubkey: formValues.selectedCollection,
                        });
                        setCreatedNft(createdNFT);
                        setNftCreatedSuccessfully(true);
                    } else {
                        createdNFT = await createSingleNFT(data);
                        setCreatedNft(createdNFT);
                        setNftCreatedSuccessfully(true);
                    }

                    return createdNFT;
                } catch {
                    setCreateError('Something went wrong during this process');
                } finally {
                    setIsCreating(false);
                }
            };
            createNft();
        },
    });

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        validateField,
        isValid,
        submitForm,
        validateForm,
        setTouched,
    } = formik;

    useEffect(() => {
        validateField('previewImage');
    }, [values?.previewImage]);

    const isImage = values?.mainFile?.type?.startsWith('image/');

    useEffect(() => {
        if (isImage) {
            setFieldValue('previewImage', null);
        }
        validateField('mainFile');
    }, [values?.mainFile]);

    function retryCollections() {
        nftRefetch();
        collectionsListRefetch();
    }

    return (
        <div className="container">
            <h1 className="fontx-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
                Create NFT
            </h1>

            <div className="mx-auto max-w-[48.125rem]">
                <NftAssetPreviewer
                    title={
                        <>
                            Image, Video, Audio, or 3D Model
                            <span className="text-red-500 -500">*</span>
                        </>
                    }
                    errorMessage={
                        touched.mainFile && errors.mainFile && typeof errors.mainFile === 'string'
                            ? errors.mainFile
                            : ''
                    }
                    file={values.mainFile}
                    onChange={async (e) => {
                        await setFieldValue('mainFile', e);
                        await setFieldTouched('mainFile', true);
                        await validateField('mainFile');
                        await validateForm();
                    }}
                    onRemove={() => {
                        setFieldValue('mainFile', null);
                    }}
                    acceptedFileTypes={mainNftAssetAcceptableExtensions}
                    maxSize={100}
                    minSize={0}
                />

                {/* Only display the 2nd image uploader when the first asset isn't of type image */}
                {/* For example: the user selects a 3D asset for the nft */}
                {/* but the user still needs an image for the nft in order to display it in the auction house with a preview */}
                {values.mainFile && !isImage ? (
                    <NftAssetPreviewer
                        title={
                            <>
                                Preview Image
                                <span className="text-red-500 ">*</span>
                                <div className="dark:text-jacarta-300 text-2xs">
                                    Since the main asset is not an image type, a preview image is also required
                                </div>
                            </>
                        }
                        errorMessage={touched.previewImage && errors.previewImage ? errors.previewImage : ''}
                        file={values.previewImage}
                        onChange={async (e) => {
                            if (e instanceof File) {
                                await setFieldValue('previewImage', e, false);
                                await setFieldTouched('previewImage', true, false);
                                await validateField('previewImage');
                                await validateForm();
                            }
                        }}
                        onRemove={() => {
                            setFieldValue('previewImage', null);
                        }}
                        acceptedFileTypes={nftAcceptableImageExtensions}
                        maxSize={5}
                        minSize={0}
                    />
                ) : null}

                <div className="mb-6">
                    <label htmlFor="item-name" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                        Name<span className="text-red-500 ">*</span>
                    </label>
                    <input
                        onBlur={handleBlur}
                        value={values.name}
                        onChange={handleChange}
                        type="text"
                        id="item-name"
                        name={'name'}
                        className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                        placeholder="Item name"
                        required
                    />
                    {touched.name && errors.name && <p className="text-red-500 -500 normal-case">{errors.name}</p>}
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                        Description<span className="text-red-500 ">*</span>
                    </label>
                    <p className="dark:text-jacarta-300 text-2xs mb-3">
                        The description will be included on the {"item's"} detail page underneath its image. Markdown
                        syntax is supported.
                    </p>
                    <textarea
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id="description"
                        name="description"
                        className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                        rows={4}
                        required
                        placeholder="Provide a detailed description of your item."
                    ></textarea>
                    {touched.description && errors.description && (
                        <p className="text-red-500 -500 normal-case">{errors.description}</p>
                    )}
                </div>

                {/* <!-- Properties --> */}
                <div className={'mb-6'}>
                    <FormikProvider value={formik}>
                        <FieldArray
                            name="attributes"
                            render={(arrayHelpers) => (
                                <div>
                                    {popupItemData.map(({ id, name, text, icon }) => {
                                        return (
                                            <div
                                                key={id}
                                                className="dark:border-jacarta-600 border-jacarta-100 relative border-b-0 py-6"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex">
                                                        {icon}

                                                        <div>
                                                            <label className="font-display text-jacarta-700 block dark:text-white">
                                                                {name}
                                                            </label>
                                                            <p className="dark:text-jacarta-300">{text}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="group dark:bg-jacarta-700 hover:bg-accent border-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-white hover:border-transparent"
                                                        onClick={() => arrayHelpers.push({ trait_type: '', value: '' })}
                                                    >
                                                        <PlusIcon className="fill-accent group-hover:fill-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <>
                                        {formik.values.attributes && formik.values.attributes.length > 0 ? (
                                            <div className="relative my-3 flex items-center">
                                                <div className="flex-1 ml-16">
                                                    <span className="font-display text-jacarta-700 mb-3 block text-base font-semibold dark:text-white">
                                                        Trait Type
                                                    </span>
                                                </div>

                                                <div className="flex-1">
                                                    <span className="font-display text-jacarta-700 mb-3 block text-base font-semibold dark:text-white">
                                                        Value
                                                    </span>
                                                </div>
                                            </div>
                                        ) : null}
                                    </>
                                    {formik.values.attributes && formik.values.attributes.length > 0
                                        ? formik.values.attributes.map((property, index) => {
                                              return (
                                                  <div key={index} className="relative my-3 flex">
                                                      <button
                                                          onClick={() => arrayHelpers.remove(index)}
                                                          className="mb-auto dark:bg-jacarta-700 dark:border-jacarta-600 dark:hover:bg-red-800 transition-colors border-jacarta-100 bg-jacarta-50 flex h-12 w-12 shrink-0 items-center justify-center self-end rounded-l-lg border border-r-0"
                                                      >
                                                          <CloseIcon className="fill-jacarta-500 dark:fill-jacarta-300 h-6 w-6" />
                                                      </button>

                                                      <div className="flex-1">
                                                          <input
                                                              value={property.trait_type}
                                                              onChange={(e) => {
                                                                  formik.setFieldTouched(
                                                                      `attributes[${index}].trait_type`,
                                                                      true
                                                                  );
                                                                  formik.handleChange(e);
                                                              }}
                                                              name={`attributes[${index}].trait_type`}
                                                              type="text"
                                                              className="dark:bg-jacarta-700 px-4 dark:border-jacarta-600 focus:ring-accent border-jacarta-100 dark:placeholder-jacarta-300 h-12 w-full border border-r-0 focus:ring-inset dark:text-white"
                                                              placeholder="Trait Type"
                                                          />
                                                          {formik.touched?.attributes?.[index]?.trait_type &&
                                                              typeof formik.errors?.attributes?.[index] !== 'string' &&
                                                              formik.errors?.attributes?.[index]?.trait_type && (
                                                                  <p className="text-red-500 -500 normal-case">
                                                                      {formik.errors.attributes[index]?.trait_type}
                                                                  </p>
                                                              )}
                                                      </div>

                                                      <div className="flex-1">
                                                          {/*<label className="font-display text-jacarta-700 mb-3 block text-base font-semibold dark:text-white">*/}
                                                          {/*    Value*/}
                                                          {/*</label>*/}
                                                          <input
                                                              value={property.value}
                                                              onChange={(e) => {
                                                                  formik.setFieldTouched(
                                                                      `attributes[${index}].value`,
                                                                      true
                                                                  );
                                                                  formik.handleChange(e);
                                                              }}
                                                              name={`attributes[${index}].value`}
                                                              type="text"
                                                              className="dark:bg-jacarta-700 px-4 dark:border-jacarta-600 focus:ring-accent border-jacarta-100 dark:placeholder-jacarta-300 h-12 w-full border border-r-0 focus:ring-inset dark:text-white"
                                                              placeholder="Value"
                                                          />
                                                          {formik.touched?.attributes?.[index]?.value &&
                                                              formik.errors?.attributes?.[index]?.value && (
                                                                  <p className="text-red-500 -500 normal-case">
                                                                      {formik.errors.attributes[index]?.value}
                                                                  </p>
                                                              )}
                                                      </div>
                                                  </div>
                                              );
                                          })
                                        : null}
                                </div>
                            )}
                        />
                    </FormikProvider>
                </div>
                <button
                    className="dark:text-white"
                    onClick={async () => {
                        return await window.phantom.solana.connect();
                    }}
                >
                    Select
                </button>

                <div className="mb-6 flex gap-4 items-center">
                    <label htmlFor="description" className="font-display text-jacarta-700 block dark:text-white">
                        Do you also want to add this to an existing collection?
                    </label>
                    <input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={String(values.isCollection)}
                        id="isCollection"
                        type="checkbox"
                        name="isCollection"
                        className="h-5 w-5 mr-3 rounded border-jacarta-200 text-accent checked:bg-accent focus:ring-accent/20 focus:ring-offset-0 dark:border-jacarta-500 dark:bg-jacarta-600"
                    />
                    {touched.isCollection && errors.isCollection && (
                        <p className="text-red-500 -500 normal-case">{errors.isCollection}</p>
                    )}
                </div>

                {values.isCollection && (
                    <div className="relative mb-6">
                        <div>
                            <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                                Collection
                            </label>
                            <div className="mb-3 flex items-center space-x-2">
                                <p className="dark:text-jacarta-300 text-2xs">
                                    This is the collection where your item will appear.
                                    <Tippy
                                        theme="tomato-theme"
                                        content={
                                            <span className="m-2 inline-block">
                                                Moving items to a different collection may take up to 30 minutes.
                                            </span>
                                        }
                                    >
                                        <span className="inline-block">
                                            <InfoIcon className="dark:fill-jacarta-300 fill-jacarta-500 ml-1 -mb-[3px] h-4 w-4" />
                                        </span>
                                    </Tippy>
                                </p>
                            </div>
                        </div>

                        <div className="dropdown my-1 cursor-pointer">
                            {nftsLoading || collectionsListLoading || collectionsListRefetching || nftsRefetching ? (
                                <Skeleton height={40} background="#676767" />
                            ) : null}

                            {collections ? (
                                <SelectCollectionDropdown
                                    collections={collections}
                                    selectedItem={values.selectedCollection}
                                    onChange={(item: NftWithCollectionStatus) =>
                                        setFieldValue('selectedCollection', item.id)
                                    }
                                />
                            ) : null}

                            {nftLoadingError || collectionsListError ? (
                                <p className="text-yellow-500 -500 normal-case">
                                    Failed to load collections list, press{' '}
                                    <span
                                        className="text-accent hover:underline cursor-pointer"
                                        onClick={retryCollections}
                                    >
                                        here
                                    </span>{' '}
                                    to try again
                                </p>
                            ) : null}
                        </div>
                        {touched.selectedCollection && errors.selectedCollection && (
                            <p className="text-red-500 -500 normal-case">{errors.selectedCollection}</p>
                        )}
                    </div>
                )}

                <button
                    onClick={() => {
                        if (!isValid) {
                            const attributesTouched = formik.values.attributes.map(() => ({
                                trait_type: true,
                                value: true,
                            }));
                            validateForm();
                            setTouched({
                                selectedCollection: true,
                                previewImage: true,
                                mainFile: true,
                                name: true,
                                description: true,
                                attributes: attributesTouched,
                            });
                        } else {
                            submitForm();
                        }
                    }}
                    className={classNames(
                        `bg-accent hover:bg-accent-dark cursor-pointer rounded-full py-3 px-8 text-center font-semibold text-white transition-all flex items-center`,
                        {
                            'bg-accent-lighter hover:bg-accent-lighter': !isValid,
                        }
                    )}
                >
                    Create
                </button>
                {createError && <p className="text-red-500 -500 normal-case">{createError}</p>}
                <NftCreatingOverlay
                    isCreating={isCreating}
                    createdSuccessfully={nftCreatedSuccessfully}
                    // createdSuccessfully={true}
                    createdNftStep={createdNftStep}
                    // redirectDelayDuration={redirectDelayDuration}
                    // redirectLocation={`/item/${createdNft?.mintAddress?.toString()}`}
                    nftCreatedRenderComponent={(closeOverlay) => (
                        <>
                            <div className="text-2xl mb-4">
                                {' '}
                                NFT Created successfully{' '}
                                {values.isCollection ? (
                                    <>
                                        and has been added to the{' '}
                                        <span className="font-bold">
                                            {
                                                collections?.find((coll) => coll.id === values?.selectedCollection)
                                                    ?.content?.metadata?.name
                                            }
                                        </span>{' '}
                                        collection
                                    </>
                                ) : null}
                            </div>

                            <div>
                                While usually instant, it might take a few minutes before the asset will appear in your
                                list
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        closeOverlay();
                                        setNftCreatedSuccessfully(false);
                                    }}
                                    className={`bg-jacarta-200 text-black hover:bg-jacarta-50 cursor-pointer rounded-full py-3 px-8 text-center font-semibold transition-all flex items-center`}
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/item/${createdNft?.mintAddress?.toString()}`}
                                    className={`bg-accent hover:bg-accent-dark cursor-pointer rounded-full py-3 px-8 text-center font-semibold text-white transition-all flex items-center`}
                                >
                                    Go to your NFT page
                                </Link>
                            </div>
                        </>
                    )}
                />
            </div>
        </div>
    );
};

export default CreateNfts;
