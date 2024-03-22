import React, { useState } from 'react';
import Link from 'next/link';
import { CaretDownIcon } from '@/shared/components/svgs/CaretDownIcon';

interface AccordionDataItem {
    id: string;
    title: string;
    text: string;
}
export const HelpAccordion = ({ data }: { data: AccordionDataItem[] }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const handleAccordion = (id: string) => {
        if (selected === id) {
            setSelected(null);
        } else {
            setSelected(id);
        }
    };
    return (
        <div>
            <h2 className="font-display text-jacarta-700 mb-10 text-center text-xl font-medium dark:text-white">
                Frequently asked questions
            </h2>
            <p className="text-jacarta-300 mx-auto mb-10 max-w-md text-center text-lg">
                Join our community now on Discord to get free updates and also alot of freebies are waiting for you or
                you can contact support
                <br />
                <Link href="/contact" className="text-accent hover:underline">
                    Here
                </Link>
            </p>

            <div className="accordion mx-auto max-w-[35rem]" id="accordionFAQ">
                {data.map((item) => {
                    const { id, title, text } = item;
                    return (
                        <div
                            key={id}
                            className="accordion-item dark:border-jacarta-600 border-jacarta-100 mb-5 overflow-hidden rounded-lg border"
                        >
                            <h2 className="accordion-header" id="faq-heading-1" onClick={() => handleAccordion(id)}>
                                <button
                                    className={
                                        selected === id
                                            ? 'dark:bg-jacarta-700 font-display text-jacarta-700 relative flex w-full items-center justify-between bg-white px-4 py-3 text-left dark:text-white '
                                            : 'dark:bg-jacarta-700 font-display text-jacarta-700 collapsed relative flex w-full items-center justify-between bg-white px-4 py-3 text-left dark:text-white '
                                    }
                                    type="button"
                                >
                                    <span>{title}</span>
                                    <CaretDownIcon className="accordion-arrow fill-jacarta-700 h-4 w-4 shrink-0 transition-transform dark:fill-white" />
                                </button>
                            </h2>
                            <div
                                id="faq-1"
                                className={
                                    selected === id
                                        ? 'accordion-collapse collapse show '
                                        : 'accordion-collapse collapse'
                                }
                                aria-labelledby="faq-heading-1"
                                data-bs-parent="#accordionFAQ"
                            >
                                <div className="accordion-body dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 border-t bg-white p-4">
                                    <p className="dark:text-jacarta-200">{text}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
