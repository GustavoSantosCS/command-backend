import {
  Decrypter,
  Encrypter,
  HashComparer,
  Hasher,
  IDGenerator
} from '@/data/protocols'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { UUIDAdapter } from '@/infra/uuid-adapter'
import { env } from '@/shared/config'

const idGenerator: IDGenerator = new UUIDAdapter()
const hasher: Hasher & HashComparer = new BcryptAdapter(12)
const crypt: Encrypter & Decrypter = new JwtAdapter(env.app.key)

export { idGenerator, hasher, crypt }
