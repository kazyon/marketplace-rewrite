import { httpsCallable } from '@firebase/functions';
import { functions } from '@/shared/firebase/config';
import { PublicUserData, publicUserDataSchema } from '@/requests/validation_schemas';

const sellCallableFunction = httpsCallable(functions, 'getUserPublicInfo');

type GetUserPublicInfoProps = {
    username?: string;
    pubkey?: string;
};

export async function getUserPublicInfo({ username, pubkey }: GetUserPublicInfoProps) {
    if (!username && !pubkey) {
        throw new Error('Missing username or pubkey');
    }

    const requestData: GetUserPublicInfoProps = {};
    if (username) {
        requestData.username = username;
    }

    if (pubkey) {
        requestData.pubkey = pubkey;
    }

    const { data: publicUserData } = await sellCallableFunction({ ...requestData });

    const parseResult = publicUserDataSchema.safeParse(publicUserData);

    if (!parseResult.success) {
        console.log({ parseResult });
        throw new Error('Parse error');
    }

    return publicUserData as PublicUserData;
}
