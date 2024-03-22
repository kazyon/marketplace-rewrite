import React, { SVGProps } from 'react';

const SolanaIcon = (props: SVGProps<any>) => {
    return (
        <svg viewBox="0 0 2000 1618.09" {...props}>
            <defs>
                <linearGradient id="0" x1="146.03" y1="1661.92" x2="1851.01" y2="-43.06" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#cf41e8" />
                    <stop offset="1" stopColor="#10f2b0" />
                </linearGradient>
            </defs>
            <path
                d="M1712.24,383A63.58,63.58,0,0,1,1667,402H64.11c-56.66,0-85.36-69.09-45.75-110.12L281.28,19.5A63.59,63.59,0,0,1,327,0H1935.89c57,0,85.55,69.81,45.24,110.64Zm0,1216.55a64.39,64.39,0,0,1-45.24,18.51H64.11c-56.66,0-85.36-67.36-45.75-107.37l262.92-265.58a64.42,64.42,0,0,1,45.75-19H1935.89c57,0,85.55,68.06,45.24,107.87Zm0-968A64.39,64.39,0,0,0,1667,613.06H64.11c-56.66,0-85.36,67.36-45.75,107.37L281.28,986A64.38,64.38,0,0,0,327,1005H1935.89c57,0,85.55-68.06,45.24-107.86Z"
                fill="url(#0)"
            />
        </svg>
    );
};

export default SolanaIcon;
