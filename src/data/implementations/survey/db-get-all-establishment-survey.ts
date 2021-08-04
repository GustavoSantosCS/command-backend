import { MusicEntity, SurveyEntity } from '@/data/entities'
import {
  GetAllEstablishmentSurveyRepository,
  GetEstablishmentByIdRepository
} from '@/data/protocols'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { GetAllEstablishmentSurveyUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBGetAllEstablishmentSurvey
  implements GetAllEstablishmentSurveyUseCase
{
  private readonly repository: GetAllEstablishmentSurveyRepository
  private readonly getAllEstablishmentById: GetEstablishmentByIdRepository

  constructor(
    getAllEstablishmentById: GetEstablishmentByIdRepository,
    repository: GetAllEstablishmentSurveyRepository
  ) {
    this.repository = repository
    this.getAllEstablishmentById = getAllEstablishmentById
  }

  async getAll(
    establishmentId: string,
    userId: string
  ): Promise<GetAllEstablishmentSurveyUseCase.Response> {
    const establishmentRepo = await this.getAllEstablishmentById.getById(
      establishmentId
    )
    if (!establishmentRepo) {
      return left(new EstablishmentNotFoundError())
    }

    let surveys = await this.repository.getAllEstablishmentSurvey(
      establishmentId
    )

    surveys = surveys.map((survey: SurveyEntity) => {
      const voteMap = new Map<string, MusicEntity & { numberOfVotes: number }>()
      const customSurvey = Object.assign(
        survey,
        this.createMyVote(survey, userId)
      )
      for (const vote of survey.pollVotes) {
        if (!voteMap.has(vote.chosenMusic.id)) {
          voteMap.set(vote.chosenMusic.id, {
            ...vote.chosenMusic,
            numberOfVotes: 0
          })
        }

        const voteTrack = voteMap.get(vote.chosenMusic.id)
        voteTrack.numberOfVotes += 1
        voteMap.set(vote.chosenMusic.id, voteTrack)
      }

      const votes = []
      for (const [, value] of voteMap) {
        votes.push(value)
      }

      delete survey.pollVotes

      return {
        ...customSurvey,
        votes
      }
    })

    return right(surveys)
  }

  private createMyVote(
    survey: SurveyEntity,
    userId: string
  ): SurveyEntity & { myVote?: any } {
    const myVote = survey.pollVotes.find(v => v.client.id === userId)

    if (!myVote) {
      return {
        ...survey,
        myVote: null
      }
    }

    return {
      ...survey,
      myVote: {
        id: myVote.id,
        chosenMusic: myVote.chosenMusic,
        createdAt: myVote.createdAt
      }
    }
  }
}
