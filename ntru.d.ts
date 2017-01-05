export interface INTRU {
	/** Maximum plaintext length. */
	plaintextBytes: number;

	/** Cyphertext length. */
	cyphertextBytes: number;

	/** Private key length. */
	privateKeyBytes: number;

	/** Public key length. */
	publicKeyBytes: number;

	/** Decrypts cyphertext with privateKey. */
	decrypt (encrypted: Uint8Array|string, privateKey: Uint8Array) : Uint8Array;

	/** Encrypts plaintext with publicKey. */
	encrypt (message: Uint8Array|string, publicKey: Uint8Array) : Uint8Array;

	/** Generates key pair. */
	keyPair () : {privateKey: Uint8Array; publicKey: Uint8Array};
};

export const ntru: INTRU;
