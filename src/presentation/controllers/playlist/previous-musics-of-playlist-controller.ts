import { MusicPlaylistEntity } from '@/data/entities'
import { PreviousPlaylistMusicUseCase } from '@/domain/usecases'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/utils/http'
import { Validator } from '@/validation/protocols'

export class PreviousPlaylistMusicController implements Controller {
  private readonly validate: Validator
  private readonly previousMusic: PreviousPlaylistMusicUseCase

  constructor (
    validate: Validator,
    previousMusic: PreviousPlaylistMusicUseCase
  ) {
    this.validate = validate
    this.previousMusic = previousMusic
  }

  async handle (
    httpRequest: HttpRequest<
    PreviousPlaylistMusicController.DTO,
    PreviousPlaylistMusicController.Param
    >
  ): Promise<PreviousPlaylistMusicController.Response> {
    try {
      const { authenticated, establishmentId } = httpRequest.body
      const { playlistId } = httpRequest.params
      const validation = this.validate.validate({
        userId: authenticated.id,
        playlistId,
        establishmentId
      })
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }

      const resultUseCase = await this.previousMusic.previousMusic({
        userId: authenticated.id,
        playlistId,
        establishmentId
      })
      if (resultUseCase.isLeft()) {
        return badRequest(resultUseCase.value)
      }

      const { value: musicPlaylistEntity } = resultUseCase

      return ok(musicPlaylistEntity)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return serverError()
    }
  }
}

// eslint-disable-Previous-line no-redeclare
export namespace PreviousPlaylistMusicController {
  export type DTO = {
    authenticated: {
      id: string
    }
    establishmentId: string
  }

  export type Param = {
    playlistId: string
  }

  export type Return = MusicPlaylistEntity | null
  export type Response = HttpResponse<Return>
}
