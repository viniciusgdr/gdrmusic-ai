import jwt from 'jsonwebtoken'
import { type Decrypter, type Encrypter } from '../../data/protocols/cryptography'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: string): Promise<string> {
    return jwt.sign({ id: plaintext }, this.secret)
  }

  async decrypt (ciphertext: string): Promise<string> {
    return jwt.verify(ciphertext, this.secret) as string
  }
}
