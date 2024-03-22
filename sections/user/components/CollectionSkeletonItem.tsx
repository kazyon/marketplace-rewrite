import classNames from 'classnames';
import Skeleton from 'tiny-skeleton-loader-react';
import React from 'react';

export const CollectionSkeletonItem = () => {
    return (
        <article>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                <div className="flex space-x-[0.625rem]">
                    <span className={classNames(`w-[74.5%] h-[242px]`)}>
                        <Skeleton background="#676767" height={230} />
                    </span>

                    <span className="flex w-1/3 flex-col space-y-[0.625rem] gap-2 h-full flex-1">
                        {Array.from({ length: 3 }, (_, index) => {
                            return <Skeleton key={index} background="#676767" width={68} height={64} />;
                        })}
                    </span>
                </div>

                <div className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
                    <Skeleton background="#676767" />
                </div>
                <span className="dark:text-jacarta-300 text-sm">
                    <Skeleton background="#676767" style={{ width: '50%', marginTop: '1em' }} />
                </span>
            </div>
        </article>
    );
};
