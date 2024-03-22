import { useState } from 'react';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { ref, uploadBytesResumable } from '@firebase/storage';
import { storage } from '@/shared/firebase/config';
import { getDownloadURL } from 'firebase/storage';

interface UseFirebaseFileUploadArgs {
    onSuccess?: (url: string) => void;
    onError?: () => void;
}
export const useFirebaseFileUpload = ({ onSuccess = () => {}, onError = () => {} }: UseFirebaseFileUploadArgs) => {
    const user = useFirebaseAuth();

    const [percentagesStatus, setPercentagesStatus] = useState<null | number>(null);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [fileUrl, setFileUrl] = useState<null | string>(null);
    const [isUploading, setIsUploading] = useState(false);

    function upload(path: string, file: File) {
        setIsSuccess(false);
        setFileUrl(null);
        try {
            if (!user) {
                throw new Error('Firebase user not present');
            }
            const storageRef = ref(storage, path);

            const uploadTask = uploadBytesResumable(storageRef, file);

            setIsUploading(true);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setPercentagesStatus(progress);
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    setIsError(true);
                    setPercentagesStatus(null);
                    setIsUploading(false);
                    setFileUrl(null);
                    // Handle unsuccessful uploads
                    console.log(error);
                    onError();
                },
                () => {
                    setIsUploading(false);
                    setIsSuccess(true);
                    setPercentagesStatus(null);
                    // TODO: something is wrong here, it shouldn't be hardcoded to /images/profile, should be generic
                    const storageRef = ref(storage, `/images/profile/${user.uid}`);
                    getDownloadURL(storageRef).then((downloadURL) => {
                        setFileUrl(downloadURL);
                        onSuccess(downloadURL);
                        console.log('File available at', downloadURL);
                    });
                }
            );
        } catch (e) {
            onError();
            setFileUrl(null);
            setIsUploading(false);
            setPercentagesStatus(null);
            setIsError(true);
            throw new Error('Something went wrong');
        }
    }

    return { percentagesStatus, upload, isError, isSuccess, isUploading, fileUrl };
};
