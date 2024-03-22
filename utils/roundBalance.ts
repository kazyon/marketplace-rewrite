/**
 *
 * @param {number} balance
 * @returns {number} rounded balance
 */

const roundBalance = (balance: number): number => {
    const roundedBalance = Number(balance).toFixed(6);
    return Number(roundedBalance);
};

export default roundBalance;
