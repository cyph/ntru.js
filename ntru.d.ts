declare module 'ntru' {
	interface INTRU {
		/** Maximum plaintext length. */
		plaintextBytes: number;

		/** Cyphertext length. */
		cyphertextBytes: number;

		/** Private key length. */
		privateKeyBytes: number;

		/** Public key length. */
		publicKeyBytes: number;

		/** Decrypts cyphertext with privateKey. */
		decrypt (encrypted: Uint8Array|string, privateKey: Uint8Array) : Promise<Uint8Array>;

		/** Encrypts plaintext with publicKey. */
		encrypt (message: Uint8Array|string, publicKey: Uint8Array) : Promise<Uint8Array>;

		/** Generates key pair. */
		keyPair (seed?: Uint8Array) : Promise<{privateKey: Uint8Array; publicKey: Uint8Array}>;

		/** Free data */
		dispose () : void;
	}

	const NTRU: INTRU;
}
