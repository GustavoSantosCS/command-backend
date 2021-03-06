import { MusicPlaylistEntity } from '@/data/entities'
import { StartPlaylistMusicUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { Validator } from '@/validation/protocols'

export class StartPlaylistMusicController implements Controller {
  private readonly validate: Validator
  private readonly startMusic: StartPlaylistMusicUseCase

  constructor(validate: Validator, startMusic: StartPlaylistMusicUseCase) {
    this.validate = validate
    this.startMusic = startMusic
  }

  async handle(
    httpRequest: HttpRequest<
      StartPlaylistMusicController.DTO,
      StartPlaylistMusicController.Param
    >
  ): Promise<StartPlaylistMusicController.Response> {
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

      const resultUseCase = await this.startMusic.startMusic({
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

export namespace StartPlaylistMusicController {
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
