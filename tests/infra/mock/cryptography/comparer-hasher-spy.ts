import { HashComparer } from '@/data/protocols'

export class HashComparerSpy implements HashComparer {
  parameters: string[]
  error: Error
  return = true
  calls = 0

  throwsError () {
    this.error = new Error('any_message')
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.parameters = [plaintext, digest]
    this.calls += 1
    if (this.error) throw this.error
    return this.return
  }
}
