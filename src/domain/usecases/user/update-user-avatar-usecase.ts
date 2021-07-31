import { AvatarEntity } from '@/data/entities'
import { Either } from '@/shared/either'

export interface UpdateUserAvatarUseCase {
  saveAvatar: (
    data: UpdateUserAvatarUseCase.Params
  ) => Promise<UpdateUserAvatarUseCase.Response>
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserAvatarUseCase {
  export type Params = {
    userId: string
    avatar: Omit<AvatarEntity, 'user'>
  }

  export type Response = Either<undefined, AvatarEntity>
}
