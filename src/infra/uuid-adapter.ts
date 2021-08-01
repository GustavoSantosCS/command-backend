import { v4 as uuid } from 'uuid'
import { UniqueIdGenerator } from '@/data/protocols'

export class UUIDAdapter implements UniqueIdGenerator {
  generate(): string {
    return uuid()
  }
}
