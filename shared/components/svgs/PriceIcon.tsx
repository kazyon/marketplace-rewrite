import React, { SVGProps } from 'react';

export const PriceIcon = (props: SVGProps<any>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" {...props}>
            <path d="M6.667 4v21.333h21.333v2.667h-24v-24h2.667zM27.057 8.391l1.885 1.885-7.609 7.609-4-3.999-5.724 5.723-1.885-1.885 7.609-7.609 4 3.999 5.724-5.723z"></path>
        </svg>
    );
};
