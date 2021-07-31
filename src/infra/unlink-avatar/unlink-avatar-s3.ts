import aws from 'aws-sdk'
import { UnlinkAvatar } from '@/data/protocols'
import { AvatarEntity } from '@/data/entities'
import { env } from '@/shared/config'

export class UnlinkAvatarS3 implements UnlinkAvatar {
  async removeAvatar(oldAvatar: AvatarEntity): Promise<void> {
    const s3 = new aws.S3()
    await s3
      .deleteObject({
        Bucket: `${env.storage.bucket.name}/avatar`,
        Key: oldAvatar.persistentName
      })
      .promise()
  }
}
