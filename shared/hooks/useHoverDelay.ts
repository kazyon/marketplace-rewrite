import { useEffect, useState } from 'react';

export const useHoverDelay = (callback: () => void, delay: number) => {
    const [isHovered, setIsHovered] = useState(false);
    let timer: NodeJS.Timeout | undefined;

    useEffect(() => {
        if (isHovered) {
            timer = setTimeout(callback, delay);
        }

        return () => clearTimeout(timer);
    }, [isHovered, callback, delay]);

    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    return { onMouseEnter, onMouseLeave };
};
