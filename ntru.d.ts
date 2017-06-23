declare module 'ntru' {
	interface INTRU {
		/** Maximum plaintext length. */
		plaintextBytes: Promise<number>;

		/** Cyphertext length. */
		cyphertextBytes: Promise<number>;

		/** Private key length. */
		privateKeyBytes: Promise<number>;

		/** Public key length. */
		publicKeyBytes: Promise<number>;

		/** Decrypts cyphertext with privateKey. */
		decrypt (encrypted: Uint8Array|string, privateKey: Uint8Array) : Promise<Uint8Array>;

		/** Encrypts plaintext with publicKey. */
		encrypt (message: Uint8Array|string, publicKey: Uint8Array) : Promise<Uint8Array>;

		/** Generates key pair. */
		keyPair () : Promise<{privateKey: Uint8Array; publicKey: Uint8Array}>;
	}

	const ntru: INTRU;
}
