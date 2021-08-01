import { MusicEntity } from '@/data/entities'
import { AddMusicUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { Validator } from '@/validation/protocols'
import { ImagePersistenceData } from '@/domain/models'

export class AddMusicController implements Controller {
  private readonly validator: Validator
  private readonly addMusic: AddMusicUseCase

  constructor(validator: Validator, addMusic: AddMusicUseCase) {
    this.validator = validator
    this.addMusic = addMusic
  }

  async handle(
    httpRequest: HttpRequest<AddMusicController.DTO, null>
  ): Promise<HttpResponse<AddMusicController.Response>> {
    try {
      const {
        authenticated,
        name,
        duration,
        talent,
        establishmentId,
        musicImage
      } = httpRequest.body

      const validation = this.validator.validate({
        name,
        duration: parseInt(duration),
        talent,
        establishmentId
      })

      if (validation.isLeft()) {
        return badRequest(validation.value)
      }

      const resultAdd = await this.addMusic.add({
        userId: authenticated.id,
        name,
        duration: parseInt(duration),
        talent,
        establishmentId,
        musicImage
      })

      if (resultAdd.isLeft()) return badRequest(resultAdd.value)

      const music: AddMusicController.Response = {
        id: resultAdd.value.id,
        name: resultAdd.value.name,
        talent: resultAdd.value.talent,
        image: resultAdd.value.image,
        duration: resultAdd.value.duration,
        createdAt: resultAdd.value.createdAt,
        updatedAt: resultAdd.value.updatedAt
      }
      return ok(music)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace AddMusicController {
  export type DTO = {
    authenticated: {
      id: string
    }
    name: string
    talent: string
    duration: string
    establishmentId: string
    musicImage: ImagePersistenceData
  }

  export type Response = Omit<MusicEntity, 'establishment' | 'playlists'>
}
