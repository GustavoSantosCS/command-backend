import { UnlinkAvatar } from '@/data/protocols';

export class UnlinkImageSpy implements UnlinkAvatar {
  parameters: any;
  error: Error;
  calls = 0;

  throwsError() {
    this.error = new Error('any_message');
  }

  async removeAvatar(oldAvatar: any): Promise<void> {
    this.calls += 1;
    this.parameters = oldAvatar;
    if (this.error) throw this.error;
  }
}
