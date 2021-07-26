import { AvatarModel } from '@/domain/models';
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
        user: { id: authenticated.id }
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
      console.error('UpdateUserAvatarController:36 => ', error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserAvatarController {
  export type DTO = {
    avatar: AvatarModel;
    authenticated: {
      id: string;
    };
  };

  export type Response = AvatarModel;
}
