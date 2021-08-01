import {
  Decrypter,
  Encrypter,
  HashComparer,
  Hasher,
  UniqueIdGenerator
} from '@/data/protocols'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { UUIDAdapter } from '@/infra/uuid-adapter'

const idGenerator: UniqueIdGenerator = new UUIDAdapter()
const hasher: Hasher & HashComparer = new BcryptAdapter()
const crypt: Encrypter & Decrypter = new JwtAdapter()

export { idGenerator, hasher, crypt }
