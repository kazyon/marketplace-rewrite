import React, { useEffect, useState } from 'react';
import { ref } from '@firebase/storage';
import { storage } from '@/shared/firebase/config';
import { getDownloadURL } from 'firebase/storage';

type RenderPropsArgs = {
    imageUrl: string;
    isFinal: boolean;
    isSuccess: boolean;
};

interface WithInjectedFirebaseImageProps {
    // isActive: boolean;
    defaultUrl: string;
    loadingElement: React.ReactElement;
    fetchErrorElement: React.ReactElement;
    value?: string | null;
    path: string;
    children: ({ imageUrl, isFinal, isSuccess }: RenderPropsArgs) => React.ReactElement;
    loading?: boolean;
    isActive?: boolean;
}

export const WithInjectedFirebaseImage = ({
    children,
    path,
    // isActive,
    defaultUrl,
    loadingElement,
    fetchErrorElement,
    value,
    loading = false,
    isActive = true,
}: WithInjectedFirebaseImageProps) => {
    const [imageFetchingLoading, setImageFetchingLoading] = useState(false);
    const [isFetchError, setIsFetchError] = useState(false);
    const [imageUrl, setImageUrl] = useState(value || defaultUrl);
    const [isFinal, setIsFinal] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (value) {
            setImageUrl(value);
        }
    }, [value]);

    const fetchProfileImg = async () => {
        setImageFetchingLoading(true);
        // TODO: Remove this after testin
        // await new Promise((res) => {
        //     setTimeout(() => res(null), 3000);
        // });

        try {
            const storageRef = ref(storage, path);
            const downloadUrl = await getDownloadURL(storageRef);
            setNotFound(true);
            setIsSuccess(true);
            setImageUrl(downloadUrl);
        } catch (e) {
            const is403Error =
                e && typeof e === 'object' && 'status' in e && typeof e.status === 'number' && e.status === 403;
            const isFirebaseNotFoundErro =
                e &&
                typeof e === 'object' &&
                'code' in e &&
                typeof e.code === 'string' &&
                e.code === 'storage/object-not-found';
            if (!is403Error && !isFirebaseNotFoundErro) {
                setIsFetchError(true);
                // setNotFound(true);
            } else {
                setNotFound(true);
            }
        } finally {
            setImageFetchingLoading(false);
            setIsFinal(true);
        }
    };

    useEffect(() => {
        if (!loading && isActive && !imageFetchingLoading) {
            fetchProfileImg();
        }
    }, [loading, isActive]);

    if (imageFetchingLoading || !isFinal) {
        return <>{loadingElement}</>;
    }

    if (value || notFound) {
        return <>{children({ imageUrl, isFinal, isSuccess })}</>;
    }

    if (isFetchError && isFinal) {
        return <>{fetchErrorElement}</>;
    }

    return <>{children({ imageUrl, isFinal, isSuccess })}</>;
};
