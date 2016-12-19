# ntru.js

## Overview

The [NTRU](https://github.com/NTRUOpenSourceProject/ntru-crypto) post-quantum asymmetric
cipher compiled to pure JavaScript using [Emscripten](https://github.com/kripken/emscripten).
A simple wrapper is provided to make NTRU easy to use in web applications.

The default parameter set is EES743EP1 (roughly 256-bit strength, as per
[NTRU's documentation](https://github.com/NTRUOpenSourceProject/ntru-crypto/blob/master/reference-code/C/Encrypt/doc/UserNotes-NTRUEncrypt.pdf)).
To change this, modify line 13 of Makefile and rebuild with `make`.

## Example Usage

	const keyPair /*: {privateKey: Uint8Array; publicKey: Uint8Array} */ =
		ntru.keyPair()
	;

	const plaintext /*: Uint8Array */ =
		new Uint8Array([104, 101, 108, 108, 111, 0]) // "hello"
	;

	const encrypted /*: Uint8Array */ =
		ntru.encrypt(plaintext, keyPair.publicKey)
	;

	const decrypted /*: Uint8Array */ =
		ntru.decrypt(encrypted, keyPair.privateKey) // same as plaintext
	;

Note: NTRU generally shouldn't be used to directly encrypt your data; in most cases, you'll
want to pair it with a symmetric cipher and use it to encrypt symmetric keys.
