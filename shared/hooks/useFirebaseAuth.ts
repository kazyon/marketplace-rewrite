import { FirebaseAuthContext } from '@/shared/context/FirebaseAuthContext';
import { useContext } from 'react';

function useFirebaseAuth() {
    const user = useContext(FirebaseAuthContext);
    if (user === undefined) {
        throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
    }
    return user;
}

export default useFirebaseAuth;
