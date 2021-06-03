import { Hasher } from '@/data/protocols/cryptography';

export class HasherSpy implements Hasher {
  parameters: string;
  error: Error;
  return: string = 'hash';

  throwsError() {
    this.error = new Error('any_message');
  }

  async hash(plaintext: string): Promise<string> {
    this.parameters = plaintext;
    if (this.error) throw this.error;
    return this.return;
  }
}
