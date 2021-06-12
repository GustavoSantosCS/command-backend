import { AvatarModel } from '@/domain/models';
import { UserAvatarUseCase } from '@/domain/usecases/user';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class UserAvatarController implements Controller {
  constructor(private readonly userAvatarUseCase: UserAvatarUseCase) {}

  async handle(
    httpRequest: HttpRequest<UserAvatarController.DTO>
  ): Promise<HttpResponse<UserAvatarController.Response>> {
    const { body } = httpRequest;
    console.log(body);
    try {
      const response = await this.userAvatarUseCase.save({
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
export namespace UserAvatarController {
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
