import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { Connection, Keypair, ParsedInstruction } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { Metadata } from '@/shared/hooks/useNfts';
import { getEstimatedPrice, getIrys } from '@/pages/api/getEstimatedUploadPrice';
import { decode } from 'bs58';

interface IrysUploadImage {
    contentType: string;
    fileName: string;
    buffer: Buffer;
}

interface TransactionInfo {
    destination: string;
    lamports: number;
    source: string;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

enum UploadAllowedFormParts {
    MAIN_FILE = 'mainAssetFile',
    SECONDARY_IMAGE_ASSET = 'secondaryAssetFile',
    METADATA = 'metadata',
    SERIALIZED_TRANSFER_TRANSACTION = 'serializedTransferTransaction',
}

const ERROR_MARGIN = 1.1;

export function getUploadKeypair() {
    if (!process.env.NEXT_UPLOAD_ACCOUNT_SECRET_KEY) {
        throw new Error('Missing NEXT_UPLOAD_ACCOUNT_SECRET_KEY env variable ');
    }
    const decoded = decode(process.env.NEXT_UPLOAD_ACCOUNT_SECRET_KEY).buffer;
    return Keypair.fromSecretKey(Buffer.from(decoded));
}

const sendTransactionAndGetTransferAmount = async (serializedTransaction: string): Promise<TransactionInfo> => {
    if (!process.env.NEXT_RPC_URL) {
        throw new Error('Missing NEXT_RPC_URL env variable');
    }

    const connection = new Connection(process.env.NEXT_RPC_URL, {
        commitment: 'finalized',
        confirmTransactionInitialTimeout: 30000,
    });
    const metaplex = Metaplex.make(connection);

    const swapTransactionBuf = Buffer.from(serializedTransaction, 'base64');
    const transactionId = await metaplex.connection.sendRawTransaction(swapTransactionBuf);

    await metaplex.connection.confirmTransaction(transactionId, 'finalized');

    const parsedTransactionData = await metaplex.connection.getParsedTransaction(transactionId, 'finalized');

    if (!parsedTransactionData) {
        throw new Error('Empty transaction transfer response.');
    }

    const keypair = getUploadKeypair();

    if (!keypair.publicKey.toString()) {
        throw new Error('Failed to read upload account info');
    }

    const transaction = parsedTransactionData.transaction.message.instructions.find((instruction) => {
        return (instruction as ParsedInstruction)?.parsed?.info.destination === keypair.publicKey.toString();
    }) as ParsedInstruction | undefined;

    return transaction?.parsed?.info;
};

interface ParseFormResults {
    mainFileBufferFull: Buffer;
    secondaryAssetBufferFull: Buffer;
    mainFileName: string;
    mainFileType: string;
    secondaryAssetFileName: string;
    serializedTransferTransaction: string;
    secondaryAssetFileType: string;
    parsedMetadata: any;
}
const parseForm = async (req: NextApiRequest) => {
    const form = formidable();

    const parseFormPromise = (): Promise<ParseFormResults> => {
        const secondaryAssetBuffer: Uint8Array[] = [];
        let secondaryAssetFileName = '';
        let secondaryAssetFileType = '';

        const mainFileBuffer: Uint8Array[] = [];
        let mainFileName = '';
        let mainFileType = '';

        let rawMetadata = '';
        let serializedTransaction = '';

        return new Promise((res, rej) => {
            form.onPart = (part) => {
                part.on('data', (buffer: Buffer) => {
                    if (part.name === UploadAllowedFormParts.SECONDARY_IMAGE_ASSET) {
                        secondaryAssetFileType = part?.mimetype ?? '';
                        secondaryAssetFileName = part.originalFilename ?? '';

                        secondaryAssetBuffer.push(buffer);
                    }

                    if (part.name === UploadAllowedFormParts.MAIN_FILE) {
                        mainFileType = part?.mimetype ?? '';
                        mainFileName = part.originalFilename ?? '';

                        mainFileBuffer.push(buffer);
                    }

                    if (part.name === UploadAllowedFormParts.METADATA) {
                        rawMetadata += buffer.toString();
                    }

                    if (part.name === UploadAllowedFormParts.SERIALIZED_TRANSFER_TRANSACTION) {
                        serializedTransaction += buffer.toString();
                    }
                });
            };

            form.parse(req, (err) => {
                if (err) {
                    rej();
                }
                const data = JSON.parse(rawMetadata);
                const secondaryAssetBufferFull = Buffer.concat(secondaryAssetBuffer);
                const mainBufferFull = Buffer.concat(mainFileBuffer);

                res({
                    parsedMetadata: data,
                    mainFileBufferFull: mainBufferFull,
                    mainFileName,
                    mainFileType,
                    secondaryAssetBufferFull: secondaryAssetBufferFull,
                    secondaryAssetFileName: secondaryAssetFileName,
                    secondaryAssetFileType: secondaryAssetFileType,
                    serializedTransferTransaction: serializedTransaction,
                });
            });
        });
    };

    return await parseFormPromise();
};

const checkTransactionValidity = (transactionInfo: TransactionInfo, uploadPrice: BigNumber) => {
    if (transactionInfo.lamports * ERROR_MARGIN < uploadPrice.toNumber()) {
        return false;
    }

    const keypair = getUploadKeypair();

    if (!keypair.publicKey.toString()) {
        throw new Error('Failed to read upload account info');
    }

    return transactionInfo.destination === keypair.publicKey.toString();
};

interface GenerateMetadataArgs {
    mainFile: IrysUploadImage;
    secondaryImageAsset: IrysUploadImage;
    metadata: Metadata;
    secondaryImageReceiptId?: string | null;
    mainFileReceiptId: string;
}
const generateMetadata = ({
    mainFile,
    metadata,
    secondaryImageReceiptId,
    mainFileReceiptId,
    secondaryImageAsset,
}: GenerateMetadataArgs) => {
    const isMainFileImage = mainFile.contentType.startsWith('image/');
    const isSecondaryAssetImage = secondaryImageAsset.contentType.startsWith('image/');

    if (isMainFileImage && isSecondaryAssetImage) {
        return {
            ...metadata,
            image: `https://gateway.irys.xyz/${mainFileReceiptId}`,
            coverImage: `https://gateway.irys.xyz/${secondaryImageReceiptId}`,
            properties: {
                files: [
                    {
                        type: mainFile.contentType,
                        uri: `https://gateway.irys.xyz/${mainFileReceiptId}`,
                    },
                    {
                        type: secondaryImageAsset.contentType,
                        uri: `https://gateway.irys.xyz/${secondaryImageReceiptId}`,
                    },
                ],
            },
        };
    }

    if (isMainFileImage) {
        return {
            ...metadata,
            image: `https://gateway.irys.xyz/${mainFileReceiptId}`,
            properties: {
                files: [
                    {
                        type: mainFile.contentType,
                        uri: `https://gateway.irys.xyz/${mainFileReceiptId}`,
                    },
                ],
            },
        };
    }

    let contentType = mainFile.contentType;
    if (mainFile.fileName.endsWith('.glb')) {
        contentType = 'vr/glb';
    }

    return {
        ...metadata,
        image: `https://gateway.irys.xyz/${secondaryImageReceiptId}`,
        properties: {
            files: [
                {
                    type: contentType,
                    uri: `https://gateway.irys.xyz/${mainFileReceiptId}`,
                },
                {
                    type: secondaryImageAsset.contentType,
                    uri: `https://gateway.irys.xyz/${secondaryImageReceiptId}`,
                },
            ],
        },
    };
};

const uploadImageAndMetadata = async (
    secondaryImageAsset: IrysUploadImage,
    mainFile: IrysUploadImage,
    metadata: Metadata,
    uploadPrice: number
) => {
    // TODO: also some error handling would be good in here
    const uploadKeypair = getUploadKeypair();

    const irys = getIrys(uploadKeypair);
    await irys.fund(uploadPrice);

    // uploads the secondary asset if found
    let secondaryAssetUploadReceiptId;
    if (secondaryImageAsset.buffer.length > 0) {
        const secondaryAssetTransaction = irys.createTransaction(secondaryImageAsset.buffer, {
            tags: [{ name: 'Content-Type', value: secondaryImageAsset.contentType }],
        });
        await secondaryAssetTransaction.sign();
        secondaryAssetUploadReceiptId = await secondaryAssetTransaction.upload();
    }

    const mainAssetTransaction = irys.createTransaction(mainFile.buffer, {
        tags: [{ name: 'Content-Type', value: mainFile.contentType }],
    });
    await mainAssetTransaction.sign();

    console.log('After preview image upload');
    const mainAssetUploadReceiptId = await mainAssetTransaction.upload();
    console.log('After main upload');

    const completeMetadata = generateMetadata({
        secondaryImageAsset: secondaryImageAsset,
        secondaryImageReceiptId: secondaryAssetUploadReceiptId?.id,
        mainFile: mainFile,
        mainFileReceiptId: mainAssetUploadReceiptId.id,
        metadata: metadata,
    });

    const metadataJson = JSON.stringify(completeMetadata);

    const metadataTx = irys.createTransaction(metadataJson, {
        tags: [{ name: 'Content-Type', value: 'text/plain' }],
    });
    await metadataTx.sign();
    const metadataReceipt = await metadataTx.upload();

    return `https://gateway.irys.xyz/${metadataReceipt.id}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not supported' });
        return;
    }

    let parseResults: ParseFormResults | null = null;

    console.log('Before form parse');
    try {
        parseResults = await parseForm(req);
    } catch (e) {
        res.status(500).send('Failed to parse request data');
        throw e;
    }
    console.log('After form parse');

    // TODO: would be good to check the results of the parse, for right shape and data
    const {
        parsedMetadata,
        mainFileBufferFull,
        mainFileName,
        mainFileType,
        secondaryAssetBufferFull,
        secondaryAssetFileName,
        secondaryAssetFileType,
        serializedTransferTransaction,
    } = parseResults;

    // TODO: also, maybe externalize this, move to a config file or something similar, to ensure both FE and BE have the same validations in terms of file size
    const _100MB = 1024 * 1024 * 100;
    const _5MB = 1024 * 1024 * 5;

    if (mainFileBufferFull.length > _100MB || secondaryAssetBufferFull.length > _5MB) {
        res.status(500).json({ message: 'Assets too big.' });
        return;
    }

    console.log('Before estimating price');
    const uploadPrice = await getEstimatedPrice(mainFileBufferFull.length + secondaryAssetBufferFull.length);
    console.log('After estimating price');

    console.log({ uploadPrice });

    const maxTryCount = 3;

    let transactionInfo: TransactionInfo | null = null;

    console.log('Before sending transaction price');

    for (let i = 0; i < maxTryCount; i++) {
        try {
            transactionInfo = await sendTransactionAndGetTransferAmount(serializedTransferTransaction);
            break;
        } catch (e) {
            console.error(e);
            console.error(`Transfer attempt failed, attempt number: ${i + 1}`);
        }
    }
    console.log('After sending transaction');

    console.log({ transactionInfo });

    if (!transactionInfo) {
        res.status(500).json({ message: 'Failed to upload.' });
        throw new Error('Failed to upload');
    }

    console.log('Before transaction validity check');
    if (!checkTransactionValidity(transactionInfo, uploadPrice)) {
        res.status(500).json({ message: 'Error' });
        return;
    }
    console.log('After transaction validity check');

    let metadataUrl: string | undefined;
    for (let i = 0; i < maxTryCount; i++) {
        try {
            metadataUrl = await uploadImageAndMetadata(
                {
                    contentType: secondaryAssetFileType,
                    fileName: secondaryAssetFileName,
                    buffer: secondaryAssetBufferFull,
                },
                {
                    contentType: mainFileType,
                    fileName: mainFileName,
                    buffer: mainFileBufferFull,
                },
                parsedMetadata,
                uploadPrice.toNumber()
            );
            break;
        } catch {
            console.error(`Failed to upload image and metadata, attempt count: ${i}, maxAttempts: ${maxTryCount}`);
        }
    }

    if (!metadataUrl) {
        res.status(500).json({ message: 'Failed to upload' });
    }

    res.status(200).json({ metadataUrl });
}
