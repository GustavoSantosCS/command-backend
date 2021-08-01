import { MusicPlaylistEntity } from '@/data/entities'
import { StopPlaylistMusicUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { Validator } from '@/validation/protocols'

export class StopPlaylistMusicController implements Controller {
  private readonly validate: Validator
  private readonly stopMusic: StopPlaylistMusicUseCase

  constructor(validate: Validator, stopMusic: StopPlaylistMusicUseCase) {
    this.validate = validate
    this.stopMusic = stopMusic
  }

  async handle(
    httpRequest: HttpRequest<
      StopPlaylistMusicController.DTO,
      StopPlaylistMusicController.Param
    >
  ): Promise<StopPlaylistMusicController.Response> {
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
      const resultUseCase = await this.stopMusic.stopMusic({
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

export namespace StopPlaylistMusicController {
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
