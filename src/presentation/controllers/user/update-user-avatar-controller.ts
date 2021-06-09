import { AvatarModel } from '@/domain/models';
import { UpdateAvatarUseCase } from '@/domain/usecases/user';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class UpdateUserAvatarController implements Controller {
  constructor(private readonly updateAvatarUseCase: UpdateAvatarUseCase) {}

  async handle(
    httpRequest: HttpRequest<UpdateUserAvatarController.DTO>
  ): Promise<HttpResponse<UpdateUserAvatarController.Response>> {
    const { body } = httpRequest;
    try {
      const response = await this.updateAvatarUseCase.updateAvatar({
        avatar: {
          new: body.avatar.new,
          old: body.avatar.old
        },
        user: {
          id: body.user.id
        }
      });

      if (response.isLeft()) {
        return serverError(response.value);
      }

      return ok(response.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserAvatarController {
  export type DTO = {
    avatar: {
      new: AvatarModel;
      old: AvatarModel;
    };
    user: {
      id: string;
    };
  };

  export type Response = {
    avatar: {
      fieldName: string;
      originalName: string;
      persistentName: string;
      target: string;
    };
  };
}
