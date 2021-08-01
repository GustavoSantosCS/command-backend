import { PlaylistEntity } from '@/data/entities'
import { AddPlayListUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { MissingParamError } from '@/validation/errors'
import { Validator } from '@/validation/protocols'

export class AddPlayListController implements Controller {
  private readonly validator: Validator
  private readonly addPlayer: AddPlayListUseCase

  constructor(validator: Validator, addPlayerUseCase: AddPlayListUseCase) {
    this.validator = validator
    this.addPlayer = addPlayerUseCase
  }

  async handle(
    httpRequest: HttpRequest<AddPlayListController.DTO>
  ): Promise<HttpResponse<AddPlayListController.Response>> {
    try {
      const { name, establishmentId, authenticated, musics } = httpRequest.body
      const validation = this.validator.validate({
        name,
        establishmentId,
        musics
      })
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }
      if (musics.length === 0) {
        return badRequest(
          new MissingParamError('Musicas Não informadas', 'musics')
        )
      }

      const resultAdd = await this.addPlayer.add({
        name,
        establishmentId,
        userId: authenticated.id,
        musics
      })

      if (resultAdd.isLeft()) {
        return badRequest(resultAdd.value)
      }

      const playerList: AddPlayListController.Response = {
        id: resultAdd.value.id,
        name: resultAdd.value.name,
        isActive: resultAdd.value.isActive,
        currentMusic: resultAdd.value.currentMusic,
        musicToPlaylist: resultAdd.value.musicToPlaylist,
        createdAt: resultAdd.value.createdAt,
        updatedAt: resultAdd.value.updatedAt
      }

      return ok(playerList)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace AddPlayListController {
  export type DTO = {
    authenticated: {
      id: string
    }
    musics: string[]
    name: string
    establishmentId: string
  }

  export type Response = Omit<PlaylistEntity, 'establishment' | 'musics'>
}
