import assert from 'assert'
import NTRU from '../'

describe('ntru test', () => {
  it('should generate keypair', async () => {
    const cipher = new NTRU()
    await cipher.init
    const keyPair = await cipher.keyPair()
    const plaintext = new Uint8Array([104, 101, 108, 108, 111, 0]) // "hello"

    const encrypted = await cipher.encrypt(plaintext, keyPair.publicKey)
    const decrypted = await cipher.decrypt(encrypted, keyPair.privateKey) // same as plaintext

    console.log(cipher.publicKeyBytes, cipher.privateKeyBytes, cipher.cyphertextBytes, cipher.plaintextBytes)
    assert.deepEqual(plaintext, decrypted)
  })
})
