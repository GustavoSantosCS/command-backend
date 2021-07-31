import { UnlinkAvatarDisc, UnlinkAvatarS3 } from '@/infra/unlink-avatar'
import { env } from '@/shared/config'

const unlinkAvatar: UnlinkAvatarDisc =
  env.storage.type === 's3' ? new UnlinkAvatarS3() : new UnlinkAvatarDisc()
export { unlinkAvatar }
