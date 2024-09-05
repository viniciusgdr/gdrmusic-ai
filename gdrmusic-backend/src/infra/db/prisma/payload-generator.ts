import { type Encrypter } from '../../../data/protocols/cryptography'
import { type GeneratePayloadSession } from '../../../data/protocols/db/GeneratePayloadSession'

export class PayloadGenerator implements GeneratePayloadSession {
  constructor (
    private readonly encrypter: Encrypter
  ) { }

  async generate (params: GeneratePayloadSession.Params): Promise<GeneratePayloadSession.Result> {
    const payload = this.addTokenUniqueRandom(params.userId)
    const encryptedPayload = await this.encrypter.encrypt(payload)
    return {
      payload: encryptedPayload
    }
  }

  private addTokenUniqueRandom (userId: string): string {
    return userId + Math.random().toString(36).substring(2, 15)
  }
}
