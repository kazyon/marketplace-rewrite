import React, { SVGProps } from 'react';

export const CheckmarkIcon = (props: SVGProps<any>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={32} height={32} {...props}>
            <path d="M13.333 20.229l12.256-12.257 1.887 1.885-14.143 14.143-8.485-8.485 1.885-1.885 6.6 6.6z"></path>
        </svg>
    );
};
