import Skeleton from 'tiny-skeleton-loader-react';
import React from 'react';

export const NftSkeletonItem = ({ withText = false }) => {
    return (
        <div className="rounded-2xl border border-jacarta-100 bg-white transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-jacarta-700">
            <div>
                <Skeleton height={230} width={230} style={{ width: '100%' }} background="#676767" />
            </div>

            {withText ? (
                <div className="mt-5 mb-2 flex items-center font-display text-base text-jacarta-700 hover:text-accent dark:text-white dark:hover:text-accent">
                    <Skeleton height="1em" style={{ width: '75%' }} background="#676767" />
                </div>
            ) : null}
        </div>
    );
};
