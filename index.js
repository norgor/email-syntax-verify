const verifier = require("./lib/verifier");

module.exports = {
	EmailSyntaxError: verifier.EmailSyntaxError,
	verifyEmail: verifier.verifyEmail,
	verifyDomain: verifier.verifyDomain,
	verifyLocalPart: verifier.verifyLocalPart,
};