import React from 'react';
import classNames from 'classnames';
import Skeleton from 'tiny-skeleton-loader-react';

type PropertiesProps = {
    properties: {
        trait_type: string;
        value: string;
    }[];
    className?: string;
    isLoading: boolean;
};

export function CollectionProperties({ properties, className = '', isLoading }: PropertiesProps) {
    return (
        <>
            <div
                className={classNames('tab-pane fade', className)}
                id="properties"
                role="tabpanel"
                aria-labelledby="properties-tab"
            >
                <div className="">
                    <div className="grid gap-5 grid-cols-[repeat(auto-fit,_minmax(200px,_300px))] justify-center">
                        {isLoading &&
                            Array.from({ length: 6 }, (_, index) => (
                                <Skeleton key={index} background="#676767" height={100} />
                            ))}
                        {!isLoading &&
                            properties.map((item, index) => {
                                const { trait_type, value } = item;
                                return (
                                    <div
                                        key={index}
                                        className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border p-5 text-center transition-shadow hover:shadow-lg"
                                    >
                                        <span className="text-accent text-sm uppercase">{trait_type}</span>
                                        <span className="text-jacarta-700 text-base dark:text-white">{value}</span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
}
