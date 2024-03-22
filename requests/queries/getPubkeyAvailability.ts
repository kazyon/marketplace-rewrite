import { httpsCallable } from '@firebase/functions';
import { functions } from '@/shared/firebase/config';

type DuplicateFunctionArgs = {
    pubkey: string;
};

type DuplicateStatusResponse = {
    pubkeyAvailable: boolean;
};
const pubkeyDuplicateStatusCallableFunction = httpsCallable<DuplicateFunctionArgs, DuplicateStatusResponse>(
    functions,
    'getPubkeyDuplicateStatus'
);

export const getPubkeyAvailability = async (pubkey?: string) => {
    if (!pubkey) {
        throw new Error('Pubkey needed for checking availability');
    }

    const { data } = await pubkeyDuplicateStatusCallableFunction({ pubkey });

    return data.pubkeyAvailable;
};
