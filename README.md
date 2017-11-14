# ntru.js

## Overview

The [NTRU](https://en.wikipedia.org/wiki/NTRUEncrypt) post-quantum asymmetric
cipher compiled to WebAssembly using [Emscripten](https://github.com/kripken/emscripten).
A simple JavaScript wrapper is provided to make NTRU easy to use in web applications.

The default parameter set is EES743EP1 (roughly 256-bit strength, as per
[NTRU's documentation](https://github.com/NTRUOpenSourceProject/NTRUEncrypt/blob/master/doc/UserNotes-NTRUEncrypt.pdf)).
To change this, modify line 13 of Makefile and rebuild with `make`.

## Example Usage

	(async () => {
		const keyPair /*: {privateKey: Uint8Array; publicKey: Uint8Array} */ =
			await ntru.keyPair()
		;

		const plaintext /*: Uint8Array */ =
			new Uint8Array([104, 101, 108, 108, 111, 0]) // "hello"
		;

		const encrypted /*: Uint8Array */ =
			await ntru.encrypt(plaintext, keyPair.publicKey)
		;

		const decrypted /*: Uint8Array */ =
			await ntru.decrypt(encrypted, keyPair.privateKey) // same as plaintext
		;

		console.log(keyPair);
		console.log(plaintext);
		console.log(encrypted);
		console.log(decrypted);
	})();

Note: NTRU generally shouldn't be used to directly encrypt your data; in most cases, you'll
want to pair it with a symmetric cipher and use it to encrypt symmetric keys.

## Changelog

Breaking changes in major versions:

3.0.0:

* As part of upgrading from asm.js to WebAssembly (with asm.js included as a fallback),
the API is fully asynchronous.

2.0.0:

* Removed some undocumented functions as part of minor API cleanup.
