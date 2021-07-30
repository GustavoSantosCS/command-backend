import { PlaylistEntity } from '@/data/entities';
import { UpdateMusicsOfPlaylistUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { IsNotTypeError, MissingParamError } from '@/validation/errors';
import { Validator } from '@/validation/protocols';

export class UpdateMusicsOfPlaylistController implements Controller {
  private readonly validate: Validator;
  private readonly updatePlaylist: UpdateMusicsOfPlaylistUseCase;

  constructor(
    validate: Validator,
    updatePlaylist: UpdateMusicsOfPlaylistUseCase
  ) {
    this.validate = validate;
    this.updatePlaylist = updatePlaylist;
  }

  async handle(
    httpRequest: HttpRequest<
      UpdateMusicsOfPlaylistController.DTO,
      UpdateMusicsOfPlaylistController.Param
    >
  ): Promise<UpdateMusicsOfPlaylistController.Response> {
    try {
      const { id, authenticated, musics, establishmentId } = httpRequest.body;

      const validation = this.validate.validate({
        userId: authenticated.id,
        musics,
        id,
        establishmentId
      });
      if (validation.isLeft()) {
        return badRequest(validation.value);
      }
      if (musics.length === 0) {
        return badRequest(
          new MissingParamError('Musicas Não informadas', 'musics')
        );
      }

      const resultUseCase = await this.updatePlaylist.updateMusicsOfPlaylist({
        userId: authenticated.id,
        musics,
        playlistId: id,
        establishmentId
      });
      if (resultUseCase.isLeft()) {
        return badRequest(resultUseCase.value);
      }

      const { value: playlist } = resultUseCase;
      const result: UpdateMusicsOfPlaylistController.Return = {
        id: playlist.id,
        name: playlist.name,
        musicToPlaylist: playlist.musicToPlaylist,
        currentMusic: playlist.currentMusic,
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
export namespace UpdateMusicsOfPlaylistController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    id: string;
    musics: string[];
    establishmentId: string;
  };

  export type Param = null;

  export type Return = Omit<PlaylistEntity, 'establishment' | 'musics'>;
  export type Response = HttpResponse<Return>;
}
