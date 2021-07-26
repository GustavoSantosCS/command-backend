import { PlaylistEntity } from '@/data/entities';
import { PlayListModel } from '@/domain/models';
import { UpdateMusicsOfPlaylistUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
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
      const { authenticated, musics, establishmentId } = httpRequest.body;
      const { playlistId } = httpRequest.params;
      const validation = this.validate.validate({
        userId: authenticated.id,
        musics,
        playlistId,
        establishmentId
      });
      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const resultUseCase = await this.updatePlaylist.updateMusicsOfPlaylist({
        userId: authenticated.id,
        musics,
        playlistId,
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
        isActive: playlist.isActive,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt
      };
      return ok(result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('UpdateMusicsOfPlaylistController:65 => ', error);
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
    musics: { id: string; position: number }[];
    establishmentId: string;
  };

  export type Param = {
    playlistId: string;
  };

  export type Return = Omit<PlaylistEntity, 'establishment' | 'musics'>;
  export type Response = HttpResponse<Return>;
}
