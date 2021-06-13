import { UnlinkAvatar } from '@/data/protocols';
import { AvatarModel } from '@/domain/models';
import { env } from '@/shared/config';
import fs from 'fs';

export class UnlinkAvatarDisc implements UnlinkAvatar {
  async removeAvatar(oldAvatar: AvatarModel): Promise<void> {
    fs.unlinkSync(
      `${env.multer.destinationRoot.disc}/${oldAvatar.persistentName}`
    );
  }
}
