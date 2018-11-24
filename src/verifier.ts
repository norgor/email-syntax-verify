export class EmailSyntaxError extends Error {
	constructor(error: string) {
		super(error);
	}
}

/**
 * Verifies that a string is a valid local part of an email address.
 * @param local The local part to verify.
 */
export function verifyLocalPart(local: string) {
	if (local == null) {
		throw new EmailSyntaxError("Local part cannot be null/undefined.");
	}

	const localQuoted = local.startsWith('"') && local.endsWith('"');
	//Remove quotes if quoted
	if (localQuoted) {
		local = local.substr(1, local.length - 2);
	}

	//Check for starting/ending dot if not quoted
	if (!localQuoted && (local.charCodeAt(0) === 0x2E /*.*/ || local.charCodeAt(local.length - 1) === 0x2E /*.*/)) {
		throw new EmailSyntaxError("Local part cannot start or end with a dot (.) unless quoted.");
	}

	//Ignore comment in beginning if not quoted
	if (!localQuoted && local.charCodeAt(0) === 0x28 /*(*/) {
		const endIndex = local.indexOf(')');
		if (endIndex !== -1) {
			local = local.substr(endIndex + 1);
		}
	}

	//Ignore comment in end if not quoted
	if (!localQuoted && local.charCodeAt(local.length - 1) === 0x29 /*)*/) {
		const startIndex = local.lastIndexOf('(');
		if (startIndex !== -1) {
			local = local.substring(0, startIndex);
		}
	}

	//Local part verification
	for (let i = 0; i < local.length; i++) {
		const cc = local.charCodeAt(i);
		//Allow alphanumeric ASCII
		if (cc >= 0x41 /*A*/ && cc <= 0x5A /*Z*/ ||
			cc >= 0x61 /*a*/ && cc <= 0x7A /*z*/ ||
			cc >= 0x30 /*0*/ && cc <= 0x39 /*9*/) {
			continue;
		//Check for consecutive dots
		} else if (cc === 0x2E /*.*/) {
			if (!localQuoted && local.charCodeAt(i + 1) === 0x2E /*.*/) {
				throw new EmailSyntaxError("Consecutive dots (.) are not allowed.");
			}
			continue;
		}
		//Validate non-quoted characters
		switch (cc) {
			case 0x21 /*!*/: continue;
			case 0x23 /*#*/: continue;
			case 0x24 /*$*/: continue;
			case 0x25 /*%*/: continue;
			case 0x26 /*&*/: continue;
			case 0x27 /*'*/: continue;
			case 0x2A /***/: continue;
			case 0x2B /*+*/: continue;
			case 0x2D /*-*/: continue;
			case 0x2F /*/*/: continue;
			case 0x3D /*=*/: continue;
			case 0x3F /*?*/: continue;
			case 0x5E /*^*/: continue;
			case 0x5F /*_*/: continue;
			case 0x60 /*`*/: continue;
			case 0x7B /*{*/: continue;
			case 0x7C /*|*/: continue;
			case 0x7D /*}*/: continue;
			case 0x7E /*~*/: continue;
		}

		//Validate quoted characters
		if (localQuoted) {
			switch (cc) {
				case 0x20 /* */: continue;
				case 0x22 /*"*/: if (local.charCodeAt(i - 1) !== 0x5C) { break; } continue;
				case 0x28 /*(*/: continue;
				case 0x29 /*)*/: continue;
				case 0x2C /*,*/: continue;
				case 0x3A /*:*/: continue;
				case 0x3B /*;*/: continue;
				case 0x3C /*<*/: continue;
				case 0x3E /*>*/: continue;
				case 0x40 /*@*/: continue;
				case 0x5B /*[*/: continue;
				case 0x5C /*\*/: if (local.charCodeAt(++i) !== 0x5C) { break; } continue;
				case 0x5D /*]*/: continue;
			}
		}

		throw new EmailSyntaxError(`The character ${String.fromCharCode(cc)} (0x${cc.toString(16)}) is not allowed in the local part.`);
	}
}

/**
 * Verifies that a string is a valid domain of an email address.
 * @param local The domain to verify.
 */
export function verifyDomain(domain: string) {
	if (domain == null) {
		throw new EmailSyntaxError("Domain cannot be null/undefined.");
	}

	let domainParts = domain.split(".");
	for (let part of domainParts) {
		if (part.length === 0) {
			throw new EmailSyntaxError("The domain cannot have an empty DNS label/multi-dot(.).");
		}

		if (part.startsWith("-") || part.endsWith("-")) {
			throw new EmailSyntaxError("DNS label cannot start or end with a hyphen(-).");
		}

		//Verify characters of the part.
		for (let i = 0; i < part.length; i++) {
			const cc = part.charCodeAt(i);
			if (cc >= 0x41 /*A*/ && cc <= 0x5A /*Z*/ ||
				cc >= 0x61 /*a*/ && cc <= 0x7A /*z*/ ||
				cc >= 0x30 /*0*/ && cc <= 0x39 /*9*/ ||
				cc == 0x2D /*-*/) {
				continue;
			}
			throw new EmailSyntaxError(`The character ${String.fromCharCode(cc)} (0x${cc.toString(16)}) is not allowed in the domain.`);
		}
	}

	//Disallow purely numeric TLD
}

/**
 * Verifies that a string is a valid email address.
 * @param email The email to verify.
 */
export function verifyEmail(email: string) : void {
	if (email == null) {
		throw new EmailSyntaxError("Email cannot be null/undefined.");
	}

	const atIndex = email.lastIndexOf('@');
	if (atIndex === -1) {
		throw new EmailSyntaxError("Email did not have an at(@).");
	} else if (atIndex === 0) {
		throw new EmailSyntaxError("Local part cannot be empty.");
	} else if (atIndex > 65) {
		throw new EmailSyntaxError("Local part was longer than 64 characters.");
	}

	if (atIndex === email.length - 1) {
		throw new EmailSyntaxError("The domain cannot be empty.");
	} else if (atIndex - (email.length - 1) > 255) {
		throw new EmailSyntaxError("The domain cannot be longer than 255 characters.");
	}

	//Extract strings
	let local = email.substring(0, atIndex);
	const domain = email.substring(atIndex + 1);

	verifyLocalPart(local);
	verifyDomain(domain);
}