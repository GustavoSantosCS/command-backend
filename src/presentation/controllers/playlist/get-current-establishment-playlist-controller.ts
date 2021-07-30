import { PlaylistEntity } from '@/data/entities';
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
      GetCurrentEstablishmentPlaylistController.DTO,
      GetCurrentEstablishmentPlaylistController.Param
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

      const result =
        await this.getCurrentPlaylist.getCurrentEstablishmentPlaylist(
          userId,
          establishmentId
        );
      if (result.isLeft()) {
        return badRequest(result.value);
      }

      const playerList: GetCurrentEstablishmentPlaylistController.Response = {
        id: result.value.id,
        name: result.value.name,
        isActive: result.value.isActive,
        currentMusic: result.value.currentMusic,
        musicToPlaylist: result.value.musicToPlaylist,
        createdAt: result.value.createdAt,
        updatedAt: result.value.updatedAt
      };

      return ok(playerList);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetCurrentEstablishmentPlaylistController {
  export type DTO = {
    authenticated: {
      id: string;
    };
  };

  export type Param = {
    establishmentId: string;
  };

  export type Response = Omit<PlaylistEntity, 'establishment' | 'musics'>;
}
