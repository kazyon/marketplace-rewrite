import { useContext } from 'react';
import { MetaplexContext } from '@/shared/context/MetaplexContext';

export const useMetaplex = () => {
    const { metaplex } = useContext(MetaplexContext);

    return { metaplex };
};
