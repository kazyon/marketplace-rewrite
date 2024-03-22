import { httpsCallable } from '@firebase/functions';
import { functions } from '@/shared/firebase/config';
import { Transaction } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

interface CancelArgs {
    receiptAddress: string;
    metaplex: Metaplex;
}
const cancelCallableFunction = httpsCallable(functions, 'cancel');
export async function postCancelTransaction({ receiptAddress, metaplex }: CancelArgs) {
    const { data: serialized } = await cancelCallableFunction({
        receiptAddress,
    });

    if (typeof serialized !== 'string') {
        throw new Error('Invalid serialized data');
    }

    const transactionBuffer = Buffer.from(serialized, 'base64');
    const transaction = Transaction.from(transactionBuffer);
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
