import { AvatarModel } from '@/domain/models';

export interface UnlinkAvatar {
  removeAvatar(oldAvatar: AvatarModel): Promise<void>;
}
