import { PlayListModel } from '@/domain/models';
import { GetCurrentEstablishmentPlaylistUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class GetCurrentEstablishmentPlaylistController implements Controller {
  private readonly validator: Validator;
  private readonly getCurrentPlaylist: GetCurrentEstablishmentPlaylistUseCase;

  constructor(
    validator: Validator,
    getCurrentPlaylistUseCase: GetCurrentEstablishmentPlaylistUseCase
  ) {
    this.validator = validator;
    this.getCurrentPlaylist = getCurrentPlaylistUseCase;
  }

  async handle(
    httpRequest: HttpRequest<
      GetCurrentEstablishmentPlaylistController.DTOBody,
      GetCurrentEstablishmentPlaylistController.DTOParam
    >
  ): Promise<HttpResponse<GetCurrentEstablishmentPlaylistController.Response>> {
    try {
      const { establishmentId } = httpRequest.params;
      const userId = httpRequest.body.authenticated.id;

      const validation = this.validator.validate({
        establishmentId
      });
      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const result = await this.getCurrentPlaylist.getCurrentPlaylist(
        userId,
        establishmentId
      );
      if (result.isLeft()) {
        return badRequest(result.value);
      }

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
      console.error('GetCurrentEstablishmentPlaylistUseCase:60 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetCurrentEstablishmentPlaylistController {
  export type DTOBody = {
    authenticated: {
      id: string;
    };
  };

  export type DTOParam = {
    establishmentId: string;
  };

  export type Response = Omit<PlayListModel, 'establishment'>;
}