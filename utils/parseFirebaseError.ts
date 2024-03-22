/**
 *
 * @param {string} error The error.code value as received from Firebase
 * @returns The error without dashes
 */

const parseFirebaseError = (error: string) => {
    if (error === undefined) {
        return 'Something went wrong';
    }
    const regexForDash = /-/g;
    const errorWithouthDashes = error.replace(regexForDash, ' ');
    const slashIndex = error.indexOf('/');
    const errorCode = errorWithouthDashes.slice(slashIndex + 2);
    const firstLetter = error.charAt(slashIndex + 1).toUpperCase();
    const parsedCode = firstLetter + errorCode;

    return parsedCode;
};

export default parseFirebaseError;
