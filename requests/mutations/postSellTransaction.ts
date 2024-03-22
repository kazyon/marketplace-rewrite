import { httpsCallable } from '@firebase/functions';
import { functions } from '@/shared/firebase/config';
import { Transaction } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

const sellCallableFunction = httpsCallable(functions, 'sell');

export interface SellMutationArgs {
    price: number;
    mintAddress: string;
    metaplex: Metaplex;
    category: string;
    physicalObjectDetails?: {
        length: number;
        width: number;
        height: number;
        weight: number;
    };
}
export async function postSellTransaction({
    price,
    mintAddress,
    metaplex,
    category,
    physicalObjectDetails,
}: SellMutationArgs) {
    const { data: serialized } = await sellCallableFunction({
        price,
        mintAddress,
        category,
        physicalObjectDetails,
    });

    if (typeof serialized !== 'string') {
        throw new Error('Invalid serialized data');
    }

    const transactionBuffer = Buffer.from(serialized, 'base64');
    const transaction = Transaction.from(transactionBuffer);
    transaction.feePayer = metaplex.identity().publicKey;
    const signedByFe = await metaplex.identity().signTransaction(transaction);
    const serializedFinal = signedByFe.serialize();

    try {
        const transactionId = await metaplex.connection.sendRawTransaction(serializedFinal);
        await metaplex.connection.confirmTransaction(transactionId);
        return await metaplex.connection.getParsedTransaction(transactionId, 'confirmed');
    } catch (e) {
        console.error('Failed to send and confirm listing transaction');
        throw e;
    }
}
