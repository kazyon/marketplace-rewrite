import { NextApiRequest, NextApiResponse } from 'next';
import Irys from '@irys/sdk';
import { Keypair } from '@solana/web3.js';
import { getUploadKeypair } from '@/pages/api/uploadNFTFileAndMetadata';
import BigNumber from 'bignumber.js';

const ERROR_MARGIN = 1.25;
const WORSE_CASE_METADATA_BYES = 1000;

const IRYS_URL = process.env.NEXT_IRYS_URL;
const RPC_URL = process.env.NEXT_RPC_URL;

export const getIrys = (keypair: Keypair) => {
    if (!IRYS_URL) {
        throw new Error('Missing NEXT_IRYS_URL env variable');
    }

    if (!RPC_URL) {
        throw new Error('Missing NEXT_RPC_URL env variable');
    }
    const token = 'solana';

    return new Irys({
        url: IRYS_URL,
        token,
        key: keypair.secretKey,
        config: { providerUrl: RPC_URL },
    });
};

export const getEstimatedPrice = async (bytes: number) => {
    const irys = getIrys(new Keypair());
    return await irys.getPrice(bytes + WORSE_CASE_METADATA_BYES);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not supported' });
        return;
    }

    const { bytes } = req.body;

    const uploadKeypair = getUploadKeypair();

    let price: BigNumber | undefined;
    try {
        price = await getEstimatedPrice(Number(bytes));
    } catch (e) {
        res.status(500).send('Something went wrong');
        throw e;
    }

    res.status(200).json({
        price: Number(price) * ERROR_MARGIN,
        uploaderAddress: uploadKeypair.publicKey.toString(),
    });
}
