import { IoIosCheckmarkCircle } from 'react-icons/io';
import { VscLoading } from 'react-icons/vsc';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// const useRedirectWithDelay = (redirectLocation: string, redirectDelayDuration: number) => {
//     const router = useRouter();
//     const timerIdRef = useRef<number | null>(null);
//
//     const triggerRedirect = () => {
//         timerIdRef.current = window.setTimeout(() => {
//             router.push(redirectLocation);
//         }, redirectDelayDuration);
//     };
//     useEffect(() => {
//         return () => {
//             if (timerIdRef.current) {
//                 clearTimeout(timerIdRef.current);
//             }
//         };
//     }, []);
//
//     return { triggerRedirect };
// };

interface NftCreatingOverlayProps {
    createdSuccessfully: boolean;
    createdNftStep?: string | null;
    // redirectDelayDuration: number;
    nftCreatedRenderComponent: (closeOverlay: () => void) => React.ReactElement;
    isCreating: boolean;
    // redirectLocation: string;
}
const NftCreatingOverlay = ({
    createdSuccessfully,
    createdNftStep,
    isCreating, // redirectLocation,
    nftCreatedRenderComponent,
}: NftCreatingOverlayProps) => {
    const [isOpen, setIsOpen] = useState(false);
    // const { triggerRedirect } = useRedirectWithDelay(redirectLocation, redirectDelayDuration);
    //
    // useEffect(() => {
    //     if (createdSuccessfully) {
    //         triggerRedirect();
    //     }
    // }, [createdSuccessfully]);

    function closeOverlay() {
        setIsOpen(false);
    }

    useEffect(() => {
        setIsOpen(isCreating || createdSuccessfully);
    }, [isCreating, createdSuccessfully]);

    return (
        <>
            {isOpen && (
                <div
                    className={
                        'fixed inset-0 bg-[#000] opacity-75 z-[100] flex items-center justify-center flex-col dark:text-white'
                    }
                >
                    <div className={'flex items-center'}>
                        {createdSuccessfully && (
                            <div className={'flex flex-col items-center p-8 max-w-2xl'}>
                                <IoIosCheckmarkCircle className={'text-[60px] text-green mb-6'} />

                                {nftCreatedRenderComponent(closeOverlay)}

                                {/*<div>You will be redirected to your NFT page</div>*/}
                                {/*<div className="w-full bg-[#ddd]">*/}
                                {/*    <div*/}
                                {/*        style={{*/}
                                {/*            animationDuration: `${redirectDelayDuration / 1000}s`,*/}
                                {/*        }}*/}
                                {/*        className={`w-0 h-[20px] bg-[#4caf50] animate-[progress_1s_linear]`}*/}
                                {/*    ></div>*/}
                                {/*</div>*/}
                            </div>
                        )}{' '}
                        {!createdSuccessfully && <VscLoading className={'mr-2 animate-spin text-[60px]'} />}
                        {createdNftStep && !createdSuccessfully && (
                            <div className={'text-[24px]'}>{createdNftStep}</div>
                        )}
                    </div>
                    {!createdSuccessfully && (
                        <div className={'mt-8'}>Please don&apos;t close the window or browser during this process.</div>
                    )}
                </div>
            )}
        </>
    );
};

export default NftCreatingOverlay;
