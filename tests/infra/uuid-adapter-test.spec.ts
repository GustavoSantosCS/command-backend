import { UniqueIdGenerator } from '@/data/protocols'
import { UUIDAdapter } from '@/infra/uuid-adapter'

let sut: UniqueIdGenerator

describe('Test unit UUIDAdapter', () => {
  beforeEach(() => {
    sut = new UUIDAdapter()
  })

  it('should generate value', () => {
    const value = sut.generate()

    expect(value).not.toBeUndefined()
  })
})
