import React, { SVGProps } from 'react';

export const MenuIcon = (props: SVGProps<any>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} {...props}>
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z" />
        </svg>
    );
};
