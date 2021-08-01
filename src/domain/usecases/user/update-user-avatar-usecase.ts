import { AvatarEntity } from '@/data/entities'
import { Either } from '@/shared/either'

export interface UpdateUserAvatarUseCase {
  saveAvatar: (
    data: UpdateUserAvatarUseCase.Params
  ) => Promise<UpdateUserAvatarUseCase.Response>
}

export namespace UpdateUserAvatarUseCase {
  export type Params = {
    userId: string
    avatar: Omit<AvatarEntity, 'user'>
  }

  export type Response = Either<undefined, AvatarEntity>
}
