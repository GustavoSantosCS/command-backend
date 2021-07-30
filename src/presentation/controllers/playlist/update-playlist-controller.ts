import { PlaylistEntity } from '@/data/entities';
import { UpdatePlaylistUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class UpdatePlaylistController implements Controller {
  private readonly validate: Validator;
  private readonly updatePlayList: UpdatePlaylistUseCase;

  constructor(validate: Validator, updatePlayList: UpdatePlaylistUseCase) {
    this.validate = validate;
    this.updatePlayList = updatePlayList;
  }

  async handle(
    httpRequest: HttpRequest<
      UpdatePlaylistController.DTO,
      UpdatePlaylistController.Param
    >
  ): Promise<UpdatePlaylistController.Response> {
    try {
      const { authenticated, establishmentId, id, active, name } =
        httpRequest.body;

      const validation = this.validate.validate({
        userId: authenticated.id,
        active,
        name,
        id,
        establishmentId
      });
      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const resultUseCase = await this.updatePlayList.updatePlaylist({
        userId: authenticated.id,
        id,
        active,
        name,
        establishmentId
      });
      if (resultUseCase.isLeft()) {
        return badRequest(resultUseCase.value);
      }

      const { value: playlist } = resultUseCase;
      const result: UpdatePlaylistController.Return = {
        id: playlist.id,
        name: playlist.name,
        isActive: playlist.isActive,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt
      };
      return ok(result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace UpdatePlaylistController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    id: string;
    name: string;
    active: boolean;
    establishmentId: string;
  };

  export type Param = null;

  export type Return = Omit<
    PlaylistEntity,
    'establishment' | 'musics' | 'musicToPlaylist' | 'currentMusic'
  >;
  export type Response = HttpResponse<Return>;
}
