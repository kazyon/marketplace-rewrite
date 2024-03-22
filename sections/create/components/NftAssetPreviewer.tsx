import React, { useMemo } from 'react';
import classNames from 'classnames';
import { DragAndDropTargetIcon } from '@/shared/components/svgs/DragAndDropTargetIcon';
import { FileUploader } from 'react-drag-drop-files';
import { RiCloseLine } from 'react-icons/ri';
import { GlbViewer } from '@/shared/components/glb-viewer/GlbViewer';

interface NftAssetPreviewProps {
    file: File | undefined | null;
    onChange: (e: unknown) => void; // because library isn't typed
    onRemove: () => void;
    errorMessage?: string;
    maxSize: number;
    minSize: number;
    acceptedFileTypes: string[];
    title: React.ReactElement | string;
}

export const NftAssetPreviewer = ({
    file,
    onChange,
    onRemove,
    errorMessage = '',
    maxSize,
    minSize = 0,
    acceptedFileTypes,
    title = '',
}: NftAssetPreviewProps) => {
    const isVideo = typeof file?.type === 'string' && file?.type.startsWith('video/');
    const isImage = typeof file?.type === 'string' && file?.type.startsWith('image/');
    const isAudio = typeof file?.type === 'string' && file?.type.startsWith('audio/');
    const isGlb = typeof file?.name === 'string' && file.name.endsWith('.glb');

    const fileName = file?.name;
    const fileType = file?.type;

    const fileUrl = useMemo(() => {
        if (file) {
            return URL.createObjectURL(file);
        }
    }, [file]);

    return (
        <div className="mb-6 w-full">
            <div className="font-display text-jacarta-700 mb-2 block dark:text-white">{title}</div>

            <p className="dark:text-jacarta-300 text-2xs mb-3">Drag or choose your file to upload</p>

            <div
                className={classNames(
                    'dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white text-center w-full',
                    {
                        'h-auto': isVideo,
                        'h-[500px]': !fileName || isGlb,
                    }
                )}
            >
                {isGlb && (
                    <>
                        <div className="absolute right-0 bottom-0 text-gray-400 text-xs select-none text-right p-1">
                            <div>Drag and hold to rotate</div>
                            <div>Scroll or pinch to zoom in/out</div>
                        </div>

                        <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
                            {fileUrl && <GlbViewer url={fileUrl} />}
                        </div>
                    </>
                )}
                {isVideo && (
                    <>
                        <video controls className="w-full">
                            <source src={fileUrl} type={fileType} />
                        </video>
                    </>
                )}

                {isAudio && (
                    <>
                        <audio controls className="w-full">
                            <source src={fileUrl} type={fileType} />
                        </audio>
                    </>
                )}

                {fileName && isImage && (
                    <img src={fileUrl} className={'w-full object-cover'} alt={'Preview for the NFT file'} />
                )}

                {!fileName && (
                    <>
                        <div
                            className={classNames(`relative z-10 cursor-pointer`, {
                                hidden: fileName,
                            })}
                        >
                            <DragAndDropTargetIcon className="fill-jacarta-500 mb-4 inline-block dark:fill-white" />
                            <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                                Accepted file types:
                                <div className="my-2">
                                    {acceptedFileTypes.map((type) => type.toUpperCase()).join(', ')}
                                </div>
                                <div>Max size: {maxSize} MB</div>
                            </p>
                        </div>
                        <div
                            className={classNames(
                                'dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100',
                                {
                                    hidden: fileName,
                                }
                            )}
                        >
                            <FileUploader
                                handleChange={onChange}
                                types={acceptedFileTypes}
                                classes="file-drag"
                                maxSize={maxSize}
                                minSize={minSize}
                            />
                        </div>
                    </>
                )}
            </div>
            {fileName && (
                <div className={'flex items-center dark:text-white'}>
                    <span>{fileName}</span>{' '}
                    <RiCloseLine className={'ml-2 text-red-500 -500 cursor-pointer'} onClick={onRemove} />
                </div>
            )}
            {errorMessage && <p className="text-red-500 -500 normal-case">{errorMessage}</p>}
        </div>
    );
};
