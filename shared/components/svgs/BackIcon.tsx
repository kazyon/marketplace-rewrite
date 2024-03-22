import React, { SVGProps } from 'react';

const BackIcon = (props: SVGProps<any>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 -960 960 960"
            className="fill-white cursor-pointer"
            {...props}
        >
            <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
        </svg>
    );
};

export default BackIcon;
