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

		/** init seed (if have) */
        init: Promise<void>;

        /** new with seed */
        new(seed: Uint8Array);

		/** Decrypts cyphertext with privateKey. */
		decrypt (encrypted: Uint8Array|string, privateKey: Uint8Array) : Promise<Uint8Array>;

		/** Encrypts plaintext with publicKey. */
		encrypt (message: Uint8Array|string, publicKey: Uint8Array) : Promise<Uint8Array>;

		/** Generates key pair. */
		keyPair () : Promise<{privateKey: Uint8Array; publicKey: Uint8Array}>;

		/** Free data */
		dispose () : void;
	}

	const NTRU: INTRU;
}
