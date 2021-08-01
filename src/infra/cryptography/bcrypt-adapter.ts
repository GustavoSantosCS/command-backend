import bcrypt from 'bcrypt'
import { HashComparer, Hasher } from '@/data/protocols'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor(salt?: number) {
    this.salt = salt || 12
  }

  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.salt)
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash)
  }
}
