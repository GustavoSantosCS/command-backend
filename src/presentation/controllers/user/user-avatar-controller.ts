import { AvatarModel, UserModel } from '@/domain/models';
import { UserAvatarUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class UserAvatarController implements Controller {
  constructor(private readonly userAvatarUseCase: UserAvatarUseCase) {}

  async handle(
    httpRequest: HttpRequest<UserAvatarController.Params>
  ): Promise<HttpResponse<UserAvatarController.Response>> {
    const { avatar, authenticated } = httpRequest.body;
    try {
      const response = await this.userAvatarUseCase.saveAvatar({
        avatar,
        user: {
          id: authenticated.id
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
  export type Params = {
    avatar: AvatarModel;
    authenticated: {
      id: string;
    };
  };

  export type Response = {
    user?: Omit<UserModel, 'password' | 'id'>;
  };
}
