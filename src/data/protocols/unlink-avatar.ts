import { AvatarEntity } from '../entities';

export interface UnlinkAvatar {
  removeAvatar(oldAvatar: AvatarEntity): Promise<void>;
}
