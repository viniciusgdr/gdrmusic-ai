import { type Encrypter } from '../../data/protocols/cryptography/encrypter'
import * as bcrypt from 'bcrypt'
import { type HashComparer } from '../../data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Encrypter, HashComparer {
  constructor (private readonly salt: string) {

  }

  async encrypt (value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, this.salt)
    return hashed
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
