import { MusicModel } from '@/domain/models';
import { AddMusicUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class AddMusicController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addMusic: AddMusicUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<AddMusicController.DTO, null>
  ): Promise<HttpResponse<AddMusicController.Response>> {
    try {
      const { authenticated, name, duration, talent, establishmentId } =
        httpRequest.body;

      const validation = this.validator.validate({
        name,
        duration,
        talent,
        establishmentId
      });

      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const resultAdd = await this.addMusic.add({
        userId: authenticated.id,
        name,
        duration: parseInt(duration),
        talent,
        establishmentId
      });

      if (resultAdd.isLeft()) return badRequest(resultAdd.value);

      const music: AddMusicController.Response = {
        id: resultAdd.value.id,
        name: resultAdd.value.name,
        talent: resultAdd.value.talent,
        duration: resultAdd.value.duration,
        createdAt: resultAdd.value.createdAt,
        updatedAt: resultAdd.value.updatedAt
      };
      return ok(music);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AddMusicController:54 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddMusicController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    name: string;
    talent: string;
    duration: string;
    establishmentId: string;
  };

  export type Response = Omit<MusicModel, 'establishment' | 'playlists'>;
}
