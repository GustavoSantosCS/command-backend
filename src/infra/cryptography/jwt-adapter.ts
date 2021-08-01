import jwt from 'jsonwebtoken'
import { env } from '@/shared/config'
import { Decrypter, Encrypter } from '@/data/protocols'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secret: string

  constructor() {
    this.secret = env.app.key
  }

  async encrypt(plaintext: any): Promise<string> {
    return jwt.sign(plaintext, this.secret)
  }

  async decrypt<T>(cipherText: string): Promise<T> {
    return jwt.verify(cipherText, this.secret) as unknown as T
  }
}
