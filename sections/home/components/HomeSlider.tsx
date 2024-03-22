import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import participant from '@/public/images/tickets/participantTicket.png';
import investor from '@/public/images/tickets/investorTicket.png';
import Image from 'next/image';

export function HomeSlider() {
    return (
        <Slider
            className="cursor-grab active:cursor-grabbing w-[calc(100%-80px)] mx-auto"
            dots
            arrows
            autoplay
            infinite
            speed={750}
            slidesToShow={1}
            autoplaySpeed={4000}
        >
            <div className={'dark:text-white'}>
                <Link href="/marketplace">
                    <Image
                        width={800}
                        height={500}
                        className={'w-full object-cover max-w-[1000px] mx-auto'}
                        src={investor.src}
                        alt={'Investor banner'}
                    />
                </Link>
            </div>
            <div className={'dark:text-white'}>
                <Link href="/marketplace">
                    <Image
                        width={800}
                        height={500}
                        className={'w-full object-cover max-w-[1000px] mx-auto'}
                        src={participant.src}
                        alt={'Participant banner'}
                    />
                </Link>
            </div>
            <div className={'dark:text-white'}>
                <iframe
                    className={'aspect-video h-auto max-w-[80vw] lg:max-w-[800px] mx-auto'}
                    width="800"
                    height="500"
                    src="https://www.youtube.com/embed/Z2pXkNi6qak?si=g0QgDxez37edHs7O"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </Slider>
    );
}
