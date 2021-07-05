import { PlayListModel } from '@/domain/models';
import { AddPlayListUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class AddPlayListController implements Controller {
  constructor(
    private readonly validate: Validator,
    private readonly addPlayerUseCase: AddPlayListUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<AddPlayListController.Body>
  ): Promise<HttpResponse<AddPlayListController.Response>> {
    try {
      const { name, establishmentId, authenticated, musics } = httpRequest.body;

      const validation = this.validate.validate({
        name,
        establishmentId,
        musics
      });

      if (validation.isLeft()) return badRequest(validation.value);

      const result = await this.addPlayerUseCase.addPlayList({
        name,
        establishmentId,
        idUser: authenticated.id,
        musics
      });
      if (result.isLeft()) return badRequest(result.value);

      const playerList: Omit<PlayListModel, 'establishment'> = {
        id: result.value.id,
        name: result.value.name,
        isActive: result.value.isActive,
        musics: result.value.musics,
        createdAt: result.value.createdAt,
        updatedAt: result.value.updatedAt
      };

      return ok(playerList);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AddPlayListController: => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddPlayListController {
  export type Body = {
    authenticated: {
      id: string;
    };
    musics: { id: string; position: number }[];
    name: string;
    establishmentId: string;
  };

  export type Response = Omit<PlayListModel, 'establishment'>;
}
