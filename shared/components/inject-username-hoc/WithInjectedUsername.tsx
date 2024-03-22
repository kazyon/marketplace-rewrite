import React from 'react';
import { useQuery } from 'react-query';
import { getUsernameFromPubkey } from '@/requests/queries/getUsernameFromPubkey';
import { getUserPublicInfo } from '@/requests/queries/getUserPublicInfo';

type WithInjectedUsernameProps = {
    pubkey: string;
    loadingComponent?: React.ReactElement;
    children: (user: any, isLoading: boolean, isError: boolean, isSuccess: boolean) => React.ReactElement;
};
const WithInjectedUsername = ({ children, pubkey, loadingComponent }: WithInjectedUsernameProps) => {
    console.log({ pubkey });
    const {
        data: user,
        isFetching: isLoading,
        isError,
        isRefetchError,
        isSuccess,
    } = useQuery({
        queryKey: ['user-public-info', pubkey],
        queryFn: () =>
            getUserPublicInfo({
                pubkey: pubkey as string,
            }),
        staleTime: 0,
        enabled: !!pubkey,
        retry: (count) => count < 1,
    });

    if (isLoading && loadingComponent) {
        return <>{loadingComponent}</>;
    }

    return <>{children(user, isLoading, isError || isRefetchError, isSuccess)}</>;
};
export { WithInjectedUsername };
