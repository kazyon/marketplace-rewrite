import { httpsCallable } from '@firebase/functions';
import { functions } from '@/shared/firebase/config';
import { Transaction } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { Buffer } from 'buffer';

interface BuyArgs {
    receiptAddress: string;
    metaplex: Metaplex;
}

const buyCallableFunction = httpsCallable(functions, 'buy');
export async function postBuyTransaction({ receiptAddress, metaplex }: BuyArgs) {
    const { data: serialized } = await buyCallableFunction({
        receiptAddress,
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
        console.error('Failed to send and confirm cancel transaction');
        throw e;
    }
}
