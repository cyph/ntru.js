#include "randombytes.h"
#include "ntru_crypto.h"
#include "ntru_crypto_ntru_encrypt_param_sets.h"


DRBG_HANDLE drbg;
uint16_t public_key_len;
uint16_t private_key_len;
uint16_t cyphertext_len;
uint16_t plaintext_len;


uint32_t dbrg_randombytes (uint8_t *out, uint32_t num_bytes) {
	randombytes_buf(out, num_bytes);
	DRBG_RET(DRBG_OK);
}

void ntrujs_init () {
	randombytes_stir();
	ntru_crypto_drbg_external_instantiate(
		(RANDOM_BYTES_FN) &dbrg_randombytes,
		&drbg
	);

	NTRU_ENCRYPT_PARAM_SET* params_data	=
		ntru_encrypt_get_params_with_id(PARAMS)
	;

	ntru_crypto_ntru_encrypt_keygen(
		drbg,
		PARAMS,
		&public_key_len,
		NULL,
		&private_key_len,
		NULL
	);

	cyphertext_len	= public_key_len - 5;
	plaintext_len	= params_data->m_len_max;
}

int ntrujs_public_key_bytes () {
	return public_key_len;
}

int ntrujs_private_key_bytes () {
	return private_key_len;
}

int ntrujs_encrypted_bytes () {
	return cyphertext_len;
}

int ntrujs_decrypted_bytes () {
	return plaintext_len;
}

int ntrujs_keypair (
	uint8_t* public_key,
	uint8_t* private_key
) {
	return ntru_crypto_ntru_encrypt_keygen(
		drbg,
		PARAMS,
		&public_key_len,
		public_key,
		&private_key_len,
		private_key
	);
}

int ntrujs_encrypt (
	uint8_t* message,
	int message_len,
	uint8_t* public_key,
	uint8_t* cyphertext
) {
	return ntru_crypto_ntru_encrypt(
		drbg,
		public_key_len,
		public_key,
		message_len,
		message,
		&cyphertext_len,
		cyphertext
	);
}

int ntrujs_decrypt (
	uint8_t* cyphertext,
	uint8_t* private_key,
	uint8_t* decrypted
) {
	uint16_t decrypted_len	= plaintext_len;

	int rc	= ntru_crypto_ntru_decrypt(
		private_key_len,
		private_key,
		cyphertext_len,
		cyphertext,
		&decrypted_len,
		decrypted
	);

	if (rc == NTRU_OK) {
		return decrypted_len;
	}
	else {
		return -rc;
	}
}
