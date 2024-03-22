import React, { forwardRef } from 'react';
import { useQuery } from 'react-query';
import { fetchMetadata } from '@/requests/queries/fetchMetadata';

export interface FetchedMetadata {
    image?: string;
    name?: string;
    description: string;
    attributes?: { trait_type: string; value: string }[];
    coverImage?: string;
    properties: {
        files: {
            type: string;
            uri: string;
        }[];
    };
}
interface WithInjectedNftMetadataProps {
    metadataUri?: string;
    loadingComponent?: React.ReactElement;
    withoutLoading?: boolean;
    children: (
        metadata: FetchedMetadata,
        isLoading: boolean,
        isError: boolean,
        isSuccess: boolean,
        refetch: () => void
    ) => React.ReactElement;
}

const WithInjectedNftMetadata = forwardRef(
    ({ children, metadataUri, loadingComponent, withoutLoading = false }: WithInjectedNftMetadataProps, ref) => {
        const {
            data: metadata,
            isFetching: isLoading,
            isError,
            isRefetchError,
            isSuccess,
            refetch,
        } = useQuery({
            queryKey: ['metadata', metadataUri],
            queryFn: () => fetchMetadata(metadataUri),
            staleTime: 0,
            enabled: !!metadataUri,
        });

        if (!metadata && !withoutLoading && !isError) {
            return <>{loadingComponent}</>;
        }

        return <>{children(metadata, isLoading, isError || isRefetchError, isSuccess, refetch)}</>;
    }
);

export { WithInjectedNftMetadata };
