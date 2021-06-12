import { UnlinkAvatar } from '@/data/protocols';
import { AvatarModel } from '@/domain/models';

import fs from 'fs';

export class UnlinkAvatarDisc implements UnlinkAvatar {
  async removeAvatar(oldAvatar: AvatarModel): Promise<void> {
    fs.unlinkSync(oldAvatar.target);
  }
}
