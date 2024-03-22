import { useState } from 'react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import * as web3 from '@solana/web3.js';
import { CreateNftInput, Metaplex } from '@metaplex-foundation/js';
import { useMetaplex } from '@/shared/hooks/useMetaplex';
enum UploadAllowedFormParts {
    MAIN_FILE = 'mainAssetFile',
    SECONDARY_IMAGE_ASSET = 'secondaryAssetFile',
    METADATA = 'metadata',
    SERIALIZED_TRANSFER_TRANSACTION = 'serializedTransferTransaction',
}
export interface Attribute {
    trait_type: string;
    value: string;
}
export interface Metadata {
    name: string;
    sellerFeeBasis: number;
    symbol: string;
    description: string;
    attributes?: Attribute[];
}

export interface CreateNFTParams {
    metadata: Metadata;
    secondaryImageAsset?: File | null;
    mainFile: File;
}

interface UploadImageAndMetadataParams {
    metaplex: Metaplex;
    secondaryAssetFile?: File | null;
    mainFile: File;
    metadata: Metadata;
}

export const useNFTs = () => {
    const { metaplex } = useMetaplex();
    const [createdNftStep, setCreatedNftStep] = useState<null | string>(null);
    const connected = !!metaplex?.identity().publicKey;
    const publicKey = metaplex?.identity().publicKey;

    const uploadImageAndMetadata = async ({
        metaplex,
        mainFile,
        secondaryAssetFile,
        metadata,
    }: UploadImageAndMetadataParams) => {
        if (!metaplex.identity()?.signTransaction || !publicKey) {
            throw new Error('Error connecting to metaplex');
        }
        setCreatedNftStep('Processing');

        const mainFileSize = mainFile.size;
        const secondaryImageAssetSize = secondaryAssetFile?.size ?? 0;

        const priceRes = await fetch('/api/getEstimatedUploadPrice', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bytes: mainFileSize + secondaryImageAssetSize,
            }),
        });

        const { price: uploadPrice, uploaderAddress } = await priceRes.json();

        const blockhashObj = await metaplex.connection.getLatestBlockhashAndContext('finalized');

        const price = await metaplex.connection.getFeeCalculatorForBlockhash(blockhashObj.value.blockhash);

        if (!price?.value) {
            throw new Error('Failed to upload');
        }
        const feePrice = price.value.lamportsPerSignature;

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(uploaderAddress),
                lamports: Number((Number(uploadPrice) + feePrice).toFixed(0)),
            })
        );

        transaction.recentBlockhash = blockhashObj.value.blockhash;
        transaction.feePayer = publicKey;

        setCreatedNftStep('Awaiting signature for upload');
        const signed = await metaplex.identity().signTransaction(transaction);

        const serialized = Buffer.from(signed.serialize()).toString('base64');

        const formData = new FormData();
        if (secondaryAssetFile) {
            formData.append(UploadAllowedFormParts.SECONDARY_IMAGE_ASSET, secondaryAssetFile);
        }
        formData.append(UploadAllowedFormParts.MAIN_FILE, mainFile);
        formData.append(UploadAllowedFormParts.SERIALIZED_TRANSFER_TRANSACTION, serialized);

        formData.append(UploadAllowedFormParts.METADATA, JSON.stringify(metadata));

        setCreatedNftStep('Uploading');

        const res = await fetch('/api/uploadNFTFileAndMetadata', {
            method: 'POST',
            body: formData,
        });

        const { metadataUrl } = await res.json();
        return metadataUrl;
    };

    const _createNFT = async ({
        metadata,
        mainFile,
        secondaryImageAsset,
        isCollection,
    }: CreateNFTParams & { isCollection?: boolean }) => {
        if (!connected || !metaplex || !publicKey) {
            throw new Error("The wallet isn't connected");
        }
        const { sellerFeeBasis, symbol, name } = metadata;
        const uri = await uploadImageAndMetadata({
            metaplex,
            metadata,
            mainFile,
            secondaryAssetFile: secondaryImageAsset,
        });

        const nftConfig: CreateNftInput = {
            uri: uri,
            name: name,
            sellerFeeBasisPoints: sellerFeeBasis,
            symbol: symbol,
            creators: [{ address: publicKey, share: 100 }],
            updateAuthority: metaplex.identity(),
        };

        if (isCollection) {
            nftConfig.isCollection = true;
        }

        if (connected) {
            setCreatedNftStep('Sending minting request');

            return await metaplex.nfts().create(nftConfig);
        }
    };

    const createNFTAndAddToCollection = async ({
        metadata,
        mainFile,
        secondaryImageAsset,
        collectionPubkey,
    }: CreateNFTParams & { collectionPubkey: string }) => {
        if (!connected || !metaplex) {
            throw new Error("The wallet isn't connected");
        }
        setCreatedNftStep('Processing');

        debugger;
        const { sellerFeeBasis, name } = metadata;

        const uri = await uploadImageAndMetadata({
            metaplex,
            metadata,
            mainFile,
            secondaryAssetFile: secondaryImageAsset,
        });

        if (connected) {
            setCreatedNftStep('Sending minting request');

            const nftConfig: CreateNftInput = {
                uri: uri,
                name: name,
                sellerFeeBasisPoints: sellerFeeBasis,
                updateAuthority: metaplex.identity(),
                collection: new PublicKey(collectionPubkey),
                collectionIsSized: true,
            };

            const nft = await metaplex.nfts().create(nftConfig);

            setCreatedNftStep('Verifying collection');

            await metaplex.nfts().verifyCollection({
                mintAddress: nft.mintAddress,
                collectionMintAddress: new PublicKey(collectionPubkey),
            });

            return nft;
        }
    };

    const createSingleNFT = async ({ metadata, mainFile, secondaryImageAsset }: CreateNFTParams) => {
        setCreatedNftStep('Processing');

        return await _createNFT({ metadata, mainFile, secondaryImageAsset: secondaryImageAsset });
    };
    const createCollectionNFT = async ({ metadata, mainFile, secondaryImageAsset }: CreateNFTParams) => {
        return await _createNFT({ metadata, mainFile, secondaryImageAsset: secondaryImageAsset, isCollection: true });
    };

    return {
        createSingleNFT,
        createCollectionNFT,
        createNFTAndAddToCollection,
        createdNftStep,
    };
};
