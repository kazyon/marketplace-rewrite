import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'tippy.js/dist/tippy.css';
import Link from 'next/link';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import React from 'react';
import { WithInjectedNftMetadata } from '@/shared/components/inject-metadata-hoc/WithInjectedNftMetadata';
import Skeleton from 'tiny-skeleton-loader-react';
import { DAS } from 'helius-sdk/dist/src/types/das-types';

interface BidsCarousel {
    items: DAS.GetAssetResponse[];
}
export const NftsCarousel = ({ items }: BidsCarousel) => {
    return (
        <>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar]}
                spaceBetween={30}
                slidesPerView="auto"
                // loop={true}
                breakpoints={{
                    240: {
                        slidesPerView: 1,
                    },
                    565: {
                        slidesPerView: 2,
                    },
                    1000: {
                        slidesPerView: 3,
                    },
                    1100: {
                        slidesPerView: 4,
                    },
                }}
                navigation={{
                    nextEl: '.bids-swiper-button-next',
                    prevEl: '.bids-swiper-button-prev',
                }}
                className=" card-slider-4-columns !py-5"
            >
                {items?.map((item) => {
                    return (
                        <SwiperSlide className="text-white" key={item.id}>
                            <WithInjectedNftMetadata
                                metadataUri={item?.content?.json_uri}
                                loadingComponent={<Skeleton height={230} background="#676767" />}
                            >
                                {(metadata) => (
                                    <article>
                                        <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg text-jacarta-500">
                                            <figure>
                                                <Link href={'/item/' + item.id}>
                                                    <img
                                                        width={230}
                                                        height={230}
                                                        src={metadata.image}
                                                        alt="item 1"
                                                        className="h-[230px] w-full rounded-[0.625rem] object-cover"
                                                    />
                                                </Link>
                                            </figure>
                                            <div className="mt-4 flex items-center justify-between">
                                                <Link href={'/item/' + item.id}>
                                                    <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                                                        {metadata.name}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                )}
                            </WithInjectedNftMetadata>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <div className="group bids-swiper-button-prev swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
                <MdKeyboardArrowLeft />
            </div>
            <div className="group bids-swiper-button-next swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
                <MdKeyboardArrowRight />
            </div>
        </>
    );
};
