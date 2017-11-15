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

Note: NTRU is a low-level cryptographic primitive, not a high-level construct like libsodium's
[crypto_box](https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html).
This module can be combined with a symmetric cipher and a MAC to provide such a construct, but you
should avoid using ntru.js directly for anything important if you lack the experience to do so.

## Changelog

Breaking changes in major versions:

3.0.0:

* As part of upgrading from asm.js to WebAssembly (with asm.js included as a fallback),
the API is fully asynchronous.

2.0.0:

* Removed some undocumented functions as part of minor API cleanup.
