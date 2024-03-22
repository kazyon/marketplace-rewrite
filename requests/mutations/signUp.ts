import { FormValues } from '@/sections/login-register/components/SIgnupForm';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/shared/firebase/config';
import { doc, writeBatch } from 'firebase/firestore';

export async function signUp({
    address,
    username,
    password,
    pubkey,
    phone,
    email,
    firstName,
    lastName,
    postalCode,
    addressDetails,
}: FormValues) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;

    const batch = writeBatch(db);

    const usernameRef = doc(db, 'usernames', username);
    batch.set(usernameRef, {
        uid: uid,
    });

    let userData: { [key: string]: string | number } = {
        firstName,
        lastName,
        unverifiedPubkey: pubkey.key,
        signedMessage: pubkey.signedMessage,
        phone,
        username,
        address_text: address.addressAsString,
        postalCode,
        addressDetails: addressDetails,
    };

    if (address.placeId && address.long && address.lat) {
        userData = { ...userData, lat: String(address.lat), long: String(address.long), placeId: address.placeId };
    }

    const userRef = doc(db, 'user', uid);
    batch.set(userRef, userData);

    await batch.commit();

    alert('finished saving user data');

    if (!auth.currentUser) {
        throw new Error();
    }
    sendEmailVerification(auth.currentUser).then(() => {
        // Email verification sent!
        // ...
        auth.signOut().then(() => {
            alert('Signup completed! Please verify your email address to login.');
        });
    });

    // alert('commited');
}
