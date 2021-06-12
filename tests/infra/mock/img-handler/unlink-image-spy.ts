import { UnlinkAvatar } from '@/data/protocols';
import { AvatarModel } from '@/domain/models';

export class UnlinkImageSpy implements UnlinkAvatar {
  parameters: any;
  error: Error;
  calls = 0;

  throwsError() {
    this.error = new Error('any_message');
  }

  async removeAvatar(oldAvatar: AvatarModel): Promise<void> {
    this.calls += 1;
    this.parameters = oldAvatar;
    if (this.error) throw this.error;
  }
}
