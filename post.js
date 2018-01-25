;

function dataReturn(returnValue, result) {
  if (returnValue === 0) {
    return result;
  }
  else {
    throw new Error('NTRU error: ' + returnValue);
  }
}

function dataResult(buffer, bytes) {
  return new Uint8Array(
      new Uint8Array(Module.HEAPU8.buffer, buffer, bytes)
  );
}

function dataFree(buffer) {
  try {
    Module._free(buffer);
  }
  catch (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  }
}


var publicKeyBytes, privateKeyBytes, cyphertextBytes, plaintextBytes;

var initiated = Module.ready.then(function () {
  Module._ntrujs_init();

  publicKeyBytes = Module._ntrujs_public_key_bytes();
  privateKeyBytes = Module._ntrujs_private_key_bytes();
  cyphertextBytes = Module._ntrujs_encrypted_bytes();
  plaintextBytes = Module._ntrujs_decrypted_bytes();
});

function NTRU(seed) {
  if (!this instanceof NTRU) {
    return new NTRU(seed);
  }

  this.seed = seed;
  var that = this;
  this.init = Module.ready.then(function () {
    Module._ntrujs_init();
    that.publicKeyBytes = Module._ntrujs_public_key_bytes();
    that.privateKeyBytes = Module._ntrujs_private_key_bytes();
    that.cyphertextBytes = Module._ntrujs_encrypted_bytes();
    that.plaintextBytes = Module._ntrujs_decrypted_bytes();
  });

  this.keyPair = function () {
    return this.init.then(function () {
      var publicKeyBuffer = Module._malloc(publicKeyBytes);
      var privateKeyBuffer = Module._malloc(privateKeyBytes);

      try {
        var returnValue = Module._ntrujs_keypair(
            publicKeyBuffer,
            privateKeyBuffer
        );

        return dataReturn(returnValue, {
          publicKey: dataResult(publicKeyBuffer, publicKeyBytes),
          privateKey: dataResult(privateKeyBuffer, privateKeyBytes)
        });
      }
      finally {
        dataFree(publicKeyBuffer);
        dataFree(privateKeyBuffer);
      }
    });
  }

  this.encrypt = function (message, publicKey) {
    return this.init.then(function () {
      if (message.length > plaintextBytes) {
        throw new Error('Plaintext length exceeds ntru.plaintextBytes.');
      }

      var messageBuffer = Module._malloc(message.length);
      var publicKeyBuffer = Module._malloc(publicKeyBytes);
      var encryptedBuffer = Module._malloc(cyphertextBytes);

      Module.writeArrayToMemory(message, messageBuffer);
      Module.writeArrayToMemory(publicKey, publicKeyBuffer);

      try {
        var returnValue = Module._ntrujs_encrypt(
            messageBuffer,
            message.length,
            publicKeyBuffer,
            encryptedBuffer
        );

        return dataReturn(
            returnValue,
            dataResult(encryptedBuffer, cyphertextBytes)
        );
      }
      finally {
        dataFree(messageBuffer);
        dataFree(publicKeyBuffer);
        dataFree(encryptedBuffer);
      }
    });
  }

  this.decrypt = function (encrypted, privateKey) {
    return this.init.then(function () {
      var encryptedBuffer = Module._malloc(cyphertextBytes);
      var privateKeyBuffer = Module._malloc(privateKeyBytes);
      var decryptedBuffer = Module._malloc(plaintextBytes);

      Module.writeArrayToMemory(encrypted, encryptedBuffer);
      Module.writeArrayToMemory(privateKey, privateKeyBuffer);

      try {
        var returnValue = Module._ntrujs_decrypt(
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
    });
  }
}

return NTRU;
}());


if (typeof module !== 'undefined' && module.exports) {
	ntru.ntru		= ntru;
	module.exports	= ntru;
}
else {
	self.ntru		= ntru;
}
