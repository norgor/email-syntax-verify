# email-syntax-verify
Email-syntax-verify is a module for performing syntactic verification of email addresses, local parts of an email and email domains.
## Installation
Run `npm i email-syntax-verify` in your package directory.
## Examples
### Verifying an email address
```
const verifier = require("email-syntax-verify");

verifier.verifyEmail("someemail@example.com");
//The email is valid
```

### Verifying a local part
```
const verifier = require("email-syntax-verify");

verifier.verifyLocalPart("someemail");
//The local part is valid
```

### Verifying an email domain
```
const verifier = require("email-syntax-verify");

verifier.verifyDomain("example.com");
//The domain is valid
```