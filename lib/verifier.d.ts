export declare class EmailSyntaxError extends Error {
    constructor(error: string);
}
export declare function verifyLocalPart(local: string): void;
export declare function verifyDomain(domain: string): void;
/**
 * Checks if the string is valid.
 * @param email The email address to validate.
 */
export declare function verifyEmail(email: string): void;
