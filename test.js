const chai = require("chai");
const assert = chai.assert;
const rewire = require("rewire");
const verifier = rewire("./lib/verifier");

describe("Email syntax verification tests", function() {
	describe("#verifyEmail", function() {
		let verifyEmail = verifier.__get__("verifyEmail");
		const validEmails = [
			"simple@example.com",
			"very.common@example.com",
			"disposable.style.email.with+symbol@example.com",
			"other.email-with-hyphen@example.com",
			"fully-qualified-domain@example.com",
			"user.name+tag+sorting@example.com",
			"x@example.com",
			"example-indeed@strange-example.com",
			"admin@mailserver1",
			"example@s.example",
			"\"address..very\"@email.com",
			"\" \"@example.org",
			"\".test\"@gmail.com",
			"\"test.\"@gmail.com",
			"(comment)abc@email.com",
			"abc(comment)@email.com",
		];

		const invalidEmails = [
			"Abc.example.com",
			"A@b@c@example.com",
			"Abc.example.com",
			"a\"b(c)d,e:f;g<h>i[j\\k]l@example.com",
			"just\"not\"right@example.com",
			"this is\not\\allowed@example.com",
			"this\\ still\\\"not\\\\allowed@example.com",
			"1234567890123456789012345678901234567890123456789012345678901234+x@example.com",
			"john..doe@example.com",
			"john.doe@example..com",
			".test@gmail.com",
			"test.@gmail.com",
			"em(commentinvalid)ail@email.com",
			"",
			null,
			undefined,
		];

		for (let valid of validEmails) {
			it(`Succeeds on '${valid}'`, () => {
				verifyEmail(valid);
			});
		}

		for (let invalid of invalidEmails) {
			it(`Fails on '${invalid}'`, () => {
				assert.throws(() => verifyEmail(invalid), verifier.__get__("EmailSyntaxError"));
			});
		}
	});
});