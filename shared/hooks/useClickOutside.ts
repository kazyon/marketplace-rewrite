import { RefObject, useCallback, useEffect, useRef } from 'react';

export function useClickOutside(handler: () => void): RefObject<HTMLElement> {
    const domNode = useRef<HTMLElement>(null);

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            const target = event.target as Node;
            // needed so that the click outside doesn't trigger for the modal overlay
            const mainElement = document.getElementById('__next');

            if (domNode.current && mainElement && !domNode.current.contains(target) && mainElement.contains(target)) {
                handler();
            }
        },
        [handler]
    );

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);

    return domNode;
}
