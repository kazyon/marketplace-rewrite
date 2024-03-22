import Link from 'next/link';
import React, { useState } from 'react';
import { addDoc } from '@firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/shared/firebase/config';
import { useFormik } from 'formik';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Spinner from '@/shared/components/spinner/Spinner';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message is too long'),
    email: z.string().email('Invalid email address'),
    agreeToTerms: z.boolean().refine((value) => value, { message: 'You must agree to the terms' }),
});

type ContractForm = z.infer<typeof contactSchema>;

const staticInitialValues = {
    name: '',
    email: '',
    message: '',
    agreeToTerms: false,
};
const ContactForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [initialValues, setInitialValues] = useState<ContractForm>(staticInitialValues);
    const { values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit } = useFormik<ContractForm>({
        enableReinitialize: true,
        validateOnBlur: true,
        validateOnChange: true,
        initialValues: initialValues,
        validate: (values) => {
            const result = contactSchema.safeParse(values);
            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                type FieldErrors = typeof fieldErrors & { [key: string]: string };
                for (const key in fieldErrors as FieldErrors) {
                    (fieldErrors as FieldErrors)[key] = (fieldErrors as FieldErrors)[key][0];
                }
                return fieldErrors;
            }
        },
        onSubmit: async (values) => {
            try {
                setSubmitting(true);
                await addDoc(collection(db, 'mail'), {
                    to: 'network30contact@gmail.com',
                    message: {
                        subject: `Message from ${values.name} <${values.email}>`,
                        text: values.message,
                    },
                });
                toast.success(<div> Message sent successfully </div>, {
                    duration: 4000,
                    position: 'bottom-center',
                });
                setInitialValues({ ...staticInitialValues });
            } catch (error) {
                toast.error(<div>Message not sent. Please try again later.</div>, {
                    duration: 4000,
                    position: 'bottom-center',
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex space-x-7">
                <div className="mb-6 w-1/2">
                    <label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
                        Name<span className="text-red-500 ">*</span>
                    </label>
                    <input
                        name="name"
                        className="contact-form-input dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                        id="name"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {touched.name && errors.name && <p className="text-red-500 -500 normal-case mt-2">{errors.name}</p>}
                </div>

                <div className="mb-6 w-1/2">
                    <label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
                        Email<span className="text-red-500 ">*</span>
                    </label>
                    <input
                        name="email"
                        className="contact-form-input dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {touched.email && errors.email && (
                        <p className="text-red-500 -500 normal-case mt-2">{errors.email}</p>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
                    Message<span className="text-red-500 ">*</span>
                </label>
                <textarea
                    id="message"
                    className="contact-form-input dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                ></textarea>
                {touched.message && errors.message && (
                    <p className="text-red-500 -500 normal-case mt-2">{errors.message}</p>
                )}
            </div>

            <div className="mb-6 flex flex-wrap items-center space-x-2">
                <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0 cursor-pointer"
                    checked={values.agreeToTerms}
                    onChange={() => {
                        setFieldValue('agreeToTerms', !values.agreeToTerms, true);
                        // setFieldTouched('agreeToTerms', true);
                    }}
                    onBlur={handleBlur}
                />
                <label className="dark:text-jacarta-200 text-sm">
                    I agree to the{' '}
                    <Link href="/pages/Terms" className="text-accent">
                        Terms of Service
                    </Link>
                </label>
                <div className="w-full">
                    {touched.agreeToTerms && errors.agreeToTerms && (
                        <p className="text-red-500 -500 normal-case mt-2">{errors.agreeToTerms}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                id="contact-form-submit"
                // onClick={async (e) => {
                //     alert('asdas');

                //     e.preventDefault();
                // }}
            >
                {submitting ? <Spinner /> : 'Send'}
            </button>

            <div
                id="contact-form-notice"
                className="relative mt-4 hidden rounded-lg border border-transparent p-4"
            ></div>
        </form>
    );
};

export default ContactForm;
