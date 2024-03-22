import { db } from '@/shared/firebase/config';
import { doc, writeBatch } from 'firebase/firestore';
import parseFirebaseError from '@/utils/parseFirebaseError';
import { FirestoreUser } from '@/requests/queries/getUser';
import { UpdateProfileFormValuesWithKeys } from '@/sections/profile/EditProfileSection';

interface UpdateUserArgs {
    uid: string;
    firestoreUser: FirestoreUser;
    changedItems: Partial<UpdateProfileFormValuesWithKeys>;
}
export async function updateUser({ uid, firestoreUser, changedItems }: UpdateUserArgs) {
    try {
        const batch = writeBatch(db);

        const usernameToAdd = changedItems.username;
        const usernameToDelete = firestoreUser?.username;
        const pubkey = firestoreUser?.pubkey;

        if (usernameToAdd) {
            if (usernameToDelete) {
                const prevusernameRef = doc(db, 'usernames', usernameToDelete);
                batch.delete(prevusernameRef);
            }
            const usernameRef = doc(db, 'usernames', usernameToAdd);
            batch.set(usernameRef, {
                uid: uid,
                pubkey: pubkey,
            });

            const sfRef = doc(db, 'user', uid);
            batch.update(sfRef, { username: usernameToAdd });
        } else {
            const sfRef = doc(db, 'user', uid);
            batch.update(sfRef, { ...changedItems });
        }

        await batch.commit();
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
            console.log(parseFirebaseError(error.code));
            throw new Error(parseFirebaseError(error.code));
        }
    }
}
