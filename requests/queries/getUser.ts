import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/firebase/config';
import { z } from 'zod';

const firestoreUserSchema = z.object({
    address_text: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
    username: z.string().min(1),
    pubkey: z.string().min(1),

    lat: z.string().optional(),
    long: z.string().optional(),
    placeId: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    bio: z.string().optional(),
});

export type FirestoreUser = z.infer<typeof firestoreUserSchema>;

export async function getUser(uid: string) {
    const docRef = doc(db, 'user', uid);

    const documentSnapshot = await getDoc(docRef);

    const data = documentSnapshot.data();

    if (!documentSnapshot && data) {
        throw new Error('Failed to find the firebase user');
    }

    const parseResult = firestoreUserSchema.safeParse(data);
    if (!parseResult.success) {
        console.error({ parseResult });
        throw new Error('Firestore user parse failure');
    }

    return data as FirestoreUser;
}
