import { AvatarEntity } from '@/data/entities';
import { UpdateUserAvatarUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class UpdateUserAvatarController implements Controller {
  private readonly updateUserAvatar: UpdateUserAvatarUseCase;

  constructor(updateUserAvatarUseCase: UpdateUserAvatarUseCase) {
    this.updateUserAvatar = updateUserAvatarUseCase;
  }

  async handle(
    httpRequest: HttpRequest<UpdateUserAvatarController.DTO>
  ): Promise<HttpResponse<UpdateUserAvatarController.Response>> {
    const { avatar, authenticated } = httpRequest.body;
    try {
      const resultUpdateUserAvatar = await this.updateUserAvatar.saveAvatar({
        avatar,
        userId: authenticated.id
      });
      if (resultUpdateUserAvatar.isLeft()) {
        return serverError(resultUpdateUserAvatar.value);
      }

      const { value: newAvatar } = resultUpdateUserAvatar;
      const updateAvatar: UpdateUserAvatarController.Response = {
        originalName: newAvatar.originalName,
        persistentName: newAvatar.persistentName,
        target: newAvatar.target
      };

      return ok(updateAvatar);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserAvatarController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    avatar: Omit<AvatarEntity, 'user'>;
  };

  export type Response = Omit<AvatarEntity, 'user'>;
}
