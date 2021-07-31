import faker from 'faker'

import { env } from '@/shared/config'
import { AvatarEntity } from '@/data/entities'

faker.locale = 'pt_BR'

export const makeMockAvatarUser = (): AvatarEntity => {
  const originalName = faker.random.word()
  const persistentName = `${faker.datatype.uuid()}-${originalName}`
  const target = `${env.app.protocol}://${env.app.host}:${env.app.port}/files/${persistentName}`
  return {
    originalName,
    persistentName,
    target,
    user: null
  }
}
