import { AvatarEntity } from '@/data/entities';
import { UnlinkAvatar } from '@/data/protocols';
import { env } from '@/shared/config';
import fs from 'fs';

export class UnlinkAvatarDisc implements UnlinkAvatar {
  async removeAvatar(oldAvatar: AvatarEntity): Promise<void> {
    fs.unlinkSync(
      `${env.multer.destinationRoot.avatar}/${oldAvatar.persistentName}`
    );
  }
}
