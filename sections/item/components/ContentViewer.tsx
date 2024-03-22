import { FetchedMetadata } from '@/shared/components/inject-metadata-hoc/WithInjectedNftMetadata';
import { GlbViewer } from '@/shared/components/glb-viewer/GlbViewer';
import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import NftsGrid from '@/shared/components/nfts-grid/nftsGrid';
import CollectionsGrid from '@/sections/user/ components/CollectionsGrid';
import { OwnedIcon } from '@/shared/components/svgs/OwnedIcon';
import { ListingIcon } from '@/shared/components/svgs/ListingIcon';
import { PriceIcon } from '@/shared/components/svgs/PriceIcon';
import classNames from 'classnames';
import { CloseIcon } from '@/shared/components/svgs/CloseIcon';
import { LuMaximize } from 'react-icons/lu';

type ContentViewerProps = {
    metadata: FetchedMetadata;
};
export function ContentViewer({ metadata }: ContentViewerProps) {
    const [imageModal, setImageModal] = useState(false);

    const [itemActive, setItemActive] = useState(1);

    const videoFile = metadata?.properties.files.find((file) => file.type.startsWith('video/'));
    const audioFile = metadata?.properties.files.find((file) => file.type.startsWith('audio/'));
    const glbFile = metadata?.properties.files.find((file) => file.type === 'vr/glb');

    const tabItem = [
        {
            id: 1,
            text: (videoFile && 'Video') || (audioFile && 'Audio') || (glbFile && '3D Asset') || 'Preview',
            icon: <OwnedIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
        {
            id: 2,
            text: 'Image',
            icon: <ListingIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
    ];

    const isImageOnly = !videoFile && !audioFile && !glbFile;

    return (
        <div
            className={classNames('w-full h-full', {
                'fixed inset-0 z-[999] flex justify-center items-center bg-jacarta-800': imageModal,
                relative: !imageModal,
            })}
        >
            {/*<button className="mb-8 dark:text-white" onClick={() => setImageModal((prevState) => !prevState)}>*/}
            {/*    <CloseIcon*/}
            {/*        className={classNames(*/}
            {/*            'fill-jacarta-200 w-[40px] h-[40px] hover:bg-jacarta-600 rounded-2lg fixed top-0 right-0',*/}
            {/*            {*/}
            {/*                hidden: !imageModal,*/}
            {/*            }*/}
            {/*        )}*/}
            {/*    />*/}

            {/*    <LuMaximize*/}
            {/*        className={classNames(*/}
            {/*            'fill-jacarta-200 w-[30px] h-[30px] hover:bg-jacarta-600 rounded-2lg absolute top-0 right-0',*/}
            {/*            {*/}
            {/*                hidden: imageModal,*/}
            {/*            }*/}
            {/*        )}*/}
            {/*    />*/}
            {/*</button>*/}
            {!isImageOnly && (
                <Tabs className="tabs h-full w-full">
                    <TabList className="nav nav-tabs mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b-0 border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
                        {tabItem.map(({ id, text, icon }) => {
                            return (
                                <Tab
                                    className="nav-item"
                                    role="presentation"
                                    key={id}
                                    onClick={() => setItemActive(id)}
                                >
                                    <button
                                        className={
                                            itemActive === id
                                                ? 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active'
                                                : 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white'
                                        }
                                    >
                                        {icon}
                                        <span className="font-display text-base font-medium">{text}</span>
                                    </button>
                                </Tab>
                            );
                        })}
                    </TabList>

                    <TabPanel className="relative h-full">
                        {glbFile && (
                            <div
                                className={classNames(`h-[400px] lg:h-[600px]`, {
                                    'h-full': imageModal,
                                })}
                            >
                                {' '}
                                <div
                                    className={classNames(
                                        'right-0 bottom-0 text-gray-400 text-xs select-none text-right p-1',
                                        {
                                            fixed: imageModal,
                                            absolute: !imageModal,
                                        }
                                    )}
                                >
                                    <div>Drag and hold to rotate</div>
                                    <div>Scroll or pinch to zoom in/out</div>
                                </div>
                                <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
                                    {glbFile.uri && <GlbViewer url={glbFile.uri} />}
                                </div>
                            </div>
                        )}

                        {videoFile && (
                            <>
                                <video controls className="w-full max-h-[80vh]">
                                    <source src={videoFile.uri} type={videoFile.type} />
                                </video>
                            </>
                        )}

                        {audioFile && (
                            <>
                                <audio controls className="w-full">
                                    <source src={audioFile.uri} type={audioFile.type} />
                                </audio>
                            </>
                        )}
                    </TabPanel>

                    <TabPanel>
                        <div
                            className={classNames({
                                'flex items-center justify-center absolute inset-0 top-[100px]': imageModal,
                            })}
                        >
                            <img
                                src={metadata?.image}
                                // alt={title}
                                className={classNames('rounded-2xl cursor-pointer h-full object-cover', {
                                    'w-full': !imageModal,
                                })}
                            />
                        </div>
                    </TabPanel>
                </Tabs>
            )}

            {isImageOnly && (
                <img
                    src={metadata?.image}
                    // alt={title}
                    className="rounded-2xl cursor-pointer object-cover w-full"
                />
            )}
        </div>
    );
}
