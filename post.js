;

function dataReturn (returnValue, result) {
	if (returnValue === 0) {
		return result;
	}
	else {
		throw new Error('NTRU error: ' + returnValue);
	}
}

function dataResult (buffer, bytes) {
	return new Uint8Array(
		new Uint8Array(Module.HEAPU8.buffer, buffer, bytes)
	);
}

function dataFree (buffer) {
	try {
		Module._free(buffer);
	}
	catch (_) {}
}


Module._ntrujs_init();


var ntru	= {
	publicKeyBytes: Module._ntrujs_public_key_bytes(),
	privateKeyBytes: Module._ntrujs_private_key_bytes(),
	cyphertextBytes: Module._ntrujs_encrypted_bytes(),
	plaintextBytes: Module._ntrujs_decrypted_bytes(),

	/* Backwards compatibility */
	publicKeyLength: Module._ntrujs_public_key_bytes(),
	privateKeyLength: Module._ntrujs_private_key_bytes(),
	encryptedDataLength: Module._ntrujs_encrypted_bytes(),
	decryptedDataLength: Module._ntrujs_decrypted_bytes(),

	keyPair: function () {
		var publicKeyBuffer		= Module._malloc(ntru.publicKeyBytes);
		var privateKeyBuffer	= Module._malloc(ntru.privateKeyBytes);

		try {
			var returnValue	= Module._ntrujs_keypair(
				publicKeyBuffer,
				privateKeyBuffer
			);

			return dataReturn(returnValue, {
				publicKey: dataResult(publicKeyBuffer, ntru.publicKeyBytes),
				privateKey: dataResult(privateKeyBuffer, ntru.privateKeyBytes)
			});
		}
		finally {
			dataFree(publicKeyBuffer);
			dataFree(privateKeyBuffer);
		}
	},

	encrypt: function (message, publicKey) {
		var messageBuffer	= Module._malloc(message.length);
		var publicKeyBuffer	= Module._malloc(ntru.publicKeyBytes);
		var encryptedBuffer	= Module._malloc(ntru.cyphertextBytes);

		Module.writeArrayToMemory(message, messageBuffer);
		Module.writeArrayToMemory(publicKey, publicKeyBuffer);

		try {
			var returnValue	= Module._ntrujs_encrypt(
				messageBuffer,
				message.length,
				publicKeyBuffer,
				encryptedBuffer
			);

			return dataReturn(
				returnValue,
				dataResult(encryptedBuffer, ntru.cyphertextBytes)
			);
		}
		finally {
			dataFree(messageBuffer);
			dataFree(publicKeyBuffer);
			dataFree(encryptedBuffer);
		}
	},

	decrypt: function (encrypted, privateKey) {
		var encryptedBuffer		= Module._malloc(ntru.cyphertextBytes);
		var privateKeyBuffer	= Module._malloc(ntru.privateKeyBytes);
		var decryptedBuffer		= Module._malloc(ntru.plaintextBytes);

		Module.writeArrayToMemory(encrypted, encryptedBuffer);
		Module.writeArrayToMemory(privateKey, privateKeyBuffer);

		try {
			var returnValue	= Module._ntrujs_decrypt(
				encryptedBuffer,
				privateKeyBuffer,
				decryptedBuffer
			);

			if (returnValue >= 0) {
				return dataResult(decryptedBuffer, returnValue);
			}
			else {
				dataReturn(-returnValue);
			}
		}
		finally {
			dataFree(encryptedBuffer);
			dataFree(privateKeyBuffer);
			dataFree(decryptedBuffer);
		}
	}
};



return ntru;

}());


if (typeof module !== 'undefined' && module.exports) {
	ntru.ntru		= ntru;
	module.exports	= ntru;
}
else {
	self.ntru		= ntru;
}
