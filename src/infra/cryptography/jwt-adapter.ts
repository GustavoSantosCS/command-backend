import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from '@/data/protocols'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: any): Promise<string> {
    return jwt.sign(plaintext, this.secret)
  }

  async decrypt<T>(ciphertext: string): Promise<T> {
    return jwt.verify(ciphertext, this.secret) as unknown as T
  }
}
