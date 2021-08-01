import { VoteEntity } from '@/data/entities/vote-entity'
import { AddVoteUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { Validator } from '@/validation/protocols'

export class AddVoteController implements Controller {
  private readonly validator: Validator
  private readonly addVote: AddVoteUseCase

  constructor(validator: Validator, addVote: AddVoteUseCase) {
    this.validator = validator
    this.addVote = addVote
  }

  async handle(
    httpRequest: HttpRequest<AddVoteController.DTO, AddVoteController.Param>
  ): Promise<AddVoteController.Response> {
    try {
      const { musicId, surveyId } = httpRequest.body
      const { id: userId } = httpRequest.body.authenticated

      const validation = this.validator.validate({
        musicId,
        surveyId
      })
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }

      const usecaseResult = await this.addVote.saveVote(
        userId,
        surveyId,
        musicId
      )
      if (usecaseResult.isLeft()) {
        return badRequest(usecaseResult.value)
      }

      return ok(usecaseResult.value)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace AddVoteController {
  export type DTO = {
    authenticated: {
      id: string
    }
    surveyId: string
    musicId: string
  }
  export type Param = null

  export type Response = HttpResponse<VoteEntity>
}
