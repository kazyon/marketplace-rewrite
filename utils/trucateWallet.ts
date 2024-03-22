/**
 *
 * @param {string} wallet
 * @returns {string} the trucanted wallet
 */

const truncateWallet = (wallet: string) => {
    const trucatedWallet = wallet.slice(0, 8) + '...' + wallet.slice(wallet.length - 8, wallet.length);

    return trucatedWallet;
};

export default truncateWallet;
