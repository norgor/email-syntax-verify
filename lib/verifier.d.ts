export declare class EmailSyntaxError extends Error {
    constructor(error: string);
}
/**
 * Verifies that a string is a valid local part of an email address.
 * @param local The local part to verify.
 */
export declare function verifyLocalPart(local: string): void;
/**
 * Verifies that a string is a valid domain of an email address.
 * @param local The domain to verify.
 */
export declare function verifyDomain(domain: string): void;
/**
 * Verifies that a string is a valid email address.
 * @param email The email to verify.
 */
export declare function verifyEmail(email: string): void;
