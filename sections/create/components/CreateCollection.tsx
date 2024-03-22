import React, { useEffect, useRef, useState } from 'react';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import classNames from 'classnames';
import { CreateNFTParams, useNFTs } from '@/shared/hooks/useNfts';
import { CreateCompressedNftOutput } from '@metaplex-foundation/js';
import { AttributesIcon } from '@/shared/components/svgs/AttributesIcon';
import NftCreatingOverlay from '@/sections/create/components/NftCreatingOverlay';
import { PlusIcon } from '@/shared/components/svgs/PlusIcon';
import { CloseIcon } from '@/shared/components/svgs/CloseIcon';
import { z } from 'zod';
import { toFormikValidate } from '@/utils/toFormikValidate';
import { NftAssetPreviewer } from '@/sections/create/components/NftAssetPreviewer';
import { nftAcceptableImageExtensions } from '@/sections/create/config';
import Link from 'next/link';

const CreateCollection = () => {
    const { createdNftStep, createCollectionNFT } = useNFTs();
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [collectionCreatedSuccessfully, setCollectionCreatedSuccessfully] = useState(false);
    const [createdCollection, setCreatedCollection] = useState<CreateCompressedNftOutput | null | undefined>(null);

    const { current: formSchema } = useRef(
        z.object({
            name: z
                .string()
                .min(1, 'Name is required')
                .refine((name) => {
                    // need the length in bytes to account for characters which are longer than a byes, for example emojis😄
                    // as per the NFT standard the max name is 32 bytes long
                    const bytes = new TextEncoder().encode(name).length;

                    return bytes < 32;
                }, 'Name is too long'),
            description: z.string().min(1, 'Description is required'),
            coverImage: z
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
        })
    );

    const formik = useFormik<z.infer<typeof formSchema>>({
        initialValues: {
            name: '',
            description: '',
            mainFile: null,
            coverImage: null,
            attributes: [],
        },
        validate: toFormikValidate(formSchema),
        onSubmit: (formValues) => {
            const createCollection = async () => {
                if (!formValues.mainFile) {
                    throw new Error('File required');
                }
                setIsCreating(true);
                setCreateError('');
                try {
                    const data: CreateNFTParams = {
                        mainFile: formValues.mainFile,
                        secondaryImageAsset: formValues.coverImage,
                        metadata: {
                            name: formValues.name,
                            description: formValues.description,
                            sellerFeeBasis: 0,
                            symbol: '',
                        },
                    };

                    if (formValues.attributes) {
                        data.metadata.attributes = formValues.attributes;
                    }

                    const createdCollection = await createCollectionNFT(data);

                    setCreatedCollection(createdCollection);
                    setCollectionCreatedSuccessfully(true);
                    return createdCollection;
                } catch {
                    setCreateError('Something went wrong during this process');
                } finally {
                    setIsCreating(false);
                }
            };
            createCollection();
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
        validateForm,
    } = formik;

    useEffect(() => {
        validateField('mainFile');
    }, [values?.mainFile]);

    useEffect(() => {
        const preventPageLeave = (event: Event) => {
            if (isCreating) {
                event.preventDefault();
            }
        };
        window.addEventListener('beforeunload', preventPageLeave);

        return () => {
            window.removeEventListener('beforeunload', preventPageLeave);
        };
    }, []);

    return (
        <div className="container">
            <h1 className="fontx-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
                Create Collection
            </h1>

            <div className="mx-auto max-w-[48.125rem]">
                <NftAssetPreviewer
                    title={
                        <>
                            Image
                            <span className="text-red-500 ">*</span>
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
                    acceptedFileTypes={nftAcceptableImageExtensions}
                    maxSize={100}
                    minSize={0}
                />

                <NftAssetPreviewer
                    title={<>Cover Image</>}
                    errorMessage={''}
                    file={values.coverImage}
                    onChange={async (e) => {
                        await setFieldValue('coverImage', e);
                        await setFieldTouched('coverImage', true);
                    }}
                    onRemove={() => {
                        setFieldValue('coverImage', null);
                    }}
                    acceptedFileTypes={nftAcceptableImageExtensions}
                    maxSize={5}
                    minSize={0}
                />
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

                <div className={'mb-6'}>
                    <FormikProvider value={formik}>
                        <FieldArray
                            name="attributes"
                            render={(arrayHelpers) => (
                                <div>
                                    <div className="dark:border-jacarta-600 border-jacarta-100 relative border-b-0 py-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex">
                                                <AttributesIcon className="icon fill-jacarta-700 mr-2 mt-px h-4 w-4 shrink-0 dark:fill-white" />

                                                <div>
                                                    <label className="font-display text-jacarta-700 block dark:text-white">
                                                        Attributes
                                                    </label>
                                                    <p className="dark:text-jacarta-300">
                                                        Set any other additional data about the NFT in here.
                                                    </p>
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
                                                  <>
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
                                                                  formik.errors?.attributes?.[index]?.trait_type && (
                                                                      <p className="text-red-500 -500 normal-case">
                                                                          {formik.errors.attributes[index]?.trait_type}
                                                                      </p>
                                                                  )}
                                                          </div>

                                                          <div className="flex-1">
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
                                                  </>
                                              );
                                          })
                                        : null}
                                </div>
                            )}
                        />
                    </FormikProvider>
                </div>
                <button
                    className={classNames(
                        `bg-accent hover:bg-accent-dark cursor-pointer rounded-full py-3 px-8 text-center font-semibold text-white transition-all flex items-center`,
                        {
                            'bg-accent-lighter hover:bg-accent-lighter': !isValid,
                        }
                    )}
                    onClick={() => {
                        if (!isValid) {
                            const attributesTouched = formik.values.attributes.map(() => ({
                                trait_type: true,
                                value: true,
                            }));
                            formik.validateForm();
                            formik.setTouched({
                                mainFile: true,
                                name: true,
                                description: true,
                                attributes: attributesTouched,
                            });
                        } else {
                            formik.submitForm();
                        }
                    }}
                >
                    Create
                </button>
                {createError && <p className="text-red-500 -500 normal-case">{createError}</p>}
                <NftCreatingOverlay
                    isCreating={isCreating}
                    createdSuccessfully={collectionCreatedSuccessfully}
                    createdNftStep={createdNftStep}
                    nftCreatedRenderComponent={(closeOverlay) => (
                        <>
                            <div className="text-2xl mb-4">Collection created successfully </div>

                            <div>
                                While usually instant, it might take a few minutes before the asset will appear in your
                                list
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        closeOverlay();
                                        setCollectionCreatedSuccessfully(false);
                                    }}
                                    className={`bg-jacarta-200 text-black hover:bg-jacarta-50 cursor-pointer rounded-full py-3 px-8 text-center font-semibold transition-all flex items-center`}
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/collection/${createdCollection?.mintAddress?.toString()}`}
                                    className={`bg-accent hover:bg-accent-dark cursor-pointer rounded-full py-3 px-8 text-center font-semibold text-white transition-all flex items-center`}
                                >
                                    Go to your collection page
                                </Link>
                            </div>
                        </>
                    )}
                />
            </div>
        </div>
    );
};

export default CreateCollection;
