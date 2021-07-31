import { IDGenerator } from '@/data/protocols'

export class IdGeneratorSpy implements IDGenerator {
  return = 'any_id'
  error: Error
  calls = 0

  throwsError () {
    this.error = new Error('any_message')
  }

  generate (): string {
    this.calls += 1
    if (this.error) throw this.error
    return this.return
  }
}
