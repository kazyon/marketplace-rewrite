/**
 *
 * @param {string} password
 * @param {string} [confirmPassword]
 * @returns boolean
 */

const basicPasswordCheck = (password: string, confirmPassword?: string) => {
    if (password.length >= 6) {
        if (password === confirmPassword || !confirmPassword) {
            return true;
        } else {
            return 'Passwords do not match';
        }
    } else {
        return 'Password needs to be at least 6 characters long';
    }
};

export default basicPasswordCheck;
