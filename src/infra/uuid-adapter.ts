import { v4 as uuid } from 'uuid'
import { IDGenerator } from '@/data/protocols'

export class UUIDAdapter implements IDGenerator {
  generate (): string {
    return uuid()
  }
}
