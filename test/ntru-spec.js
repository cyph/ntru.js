import assert from 'assert'
import ntru from '../'

describe('ntru test', () => {
  it('should generate keypair', async () => {
    const keyPair = await ntru.keyPair()
    const plaintext = new Uint8Array([104, 101, 108, 108, 111, 0]) // "hello"

    const encrypted = await ntru.encrypt(plaintext, keyPair.publicKey)
    const decrypted = await ntru.decrypt(encrypted, keyPair.privateKey) // same as plaintext

    console.log(keyPair)
    console.log(encrypted)
    assert.deepEqual(plaintext, decrypted)
  })
})
