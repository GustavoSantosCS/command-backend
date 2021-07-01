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
    private readonly addMusicUseCase: AddMusicUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<AddMusicController.Body, null>
  ): Promise<HttpResponse<AddMusicController.Response>> {
    try {
      const { authenticated, name, duration, talent, establishmentId } =
        httpRequest.body;

      const valid = this.validator.validate({
        name,
        duration,
        talent,
        establishmentId
      });

      if (valid.isLeft()) return badRequest(valid.value);

      const result = await this.addMusicUseCase.save({
        idUser: authenticated.id,
        name,
        duration: parseInt(duration),
        talent,
        establishmentId
      });

      if (result.isLeft()) return badRequest(result.value);

      const music: AddMusicController.Response = {
        id: result.value.id,
        name: result.value.name,
        talent: result.value.talent,
        duration: result.value.duration,
        createdAt: result.value.createdAt,
        updatedAt: result.value.updatedAt
      };
      return ok(music);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddMusicController {
  export type Body = {
    authenticated: {
      id: string;
    };
    name: string;
    talent: string;
    duration: string;
    establishmentId: string;
  };

  export type Response = Omit<MusicModel, 'establishment'>;
}
