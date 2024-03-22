import React, { SVGProps } from 'react';

export const FilterIcon = (props: SVGProps<any>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} {...props}>
            <path fill="none" d="M0 0H24V24H0z" />
            <path d="M21 4v2h-1l-5 7.5V22H9v-8.5L4 6H3V4h18zM6.404 6L11 12.894V20h2v-7.106L17.596 6H6.404z" />
        </svg>
    );
};