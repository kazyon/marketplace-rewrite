import React from 'react';

interface PropertiesProps {
    attributes: { trait_type: string; value: string }[];
}
export const ItemProperties = ({ attributes }: PropertiesProps) => {
    return (
        <>
            <div className="tab-pane fade" id="properties" role="tabpanel" aria-labelledby="properties-tab">
                <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-t-2lg rounded-b-2lg rounded-tl-none border bg-white p-6 md:p-10">
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                        {attributes.map((item, index) => {
                            const { value, trait_type } = item;
                            return (
                                <div
                                    key={index}
                                    className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border p-5 text-center transition-shadow hover:shadow-lg"
                                >
                                    <span className="text-accent text-sm uppercase">{trait_type}</span>
                                    <span className="text-jacarta-400 text-sm">{value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
