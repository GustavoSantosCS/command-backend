import { Hasher } from '@/data/protocols';

export class HasherSpy implements Hasher {
  parameters: string;
  error: Error;
  return: string = 'hash';
  calls = 0;

  throwsError() {
    this.error = new Error('any_message');
  }

  async hash(plaintext: string): Promise<string> {
    this.parameters = plaintext;
    this.calls += 1;
    if (this.error) throw this.error;
    return this.return;
  }
}
