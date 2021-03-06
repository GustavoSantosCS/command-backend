import { MusicPlaylistEntity } from '@/data/entities'
import { NextPlaylistMusicUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { Validator } from '@/validation/protocols'

export class NextPlaylistMusicController implements Controller {
  private readonly validate: Validator
  private readonly nextMusic: NextPlaylistMusicUseCase

  constructor(validate: Validator, nextMusic: NextPlaylistMusicUseCase) {
    this.validate = validate
    this.nextMusic = nextMusic
  }

  async handle(
    httpRequest: HttpRequest<
      NextPlaylistMusicController.DTO,
      NextPlaylistMusicController.Param
    >
  ): Promise<NextPlaylistMusicController.Response> {
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

      const resultUseCase = await this.nextMusic.nextMusic({
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
      console.error(error)
      return serverError()
    }
  }
}

export namespace NextPlaylistMusicController {
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
