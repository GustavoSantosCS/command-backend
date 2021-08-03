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
    establishmentId: string
  ): Promise<GetAllEstablishmentSurveyUseCase.Response> {
    const establishmentRepo = await this.getAllEstablishmentById.getById(
      establishmentId
    )
    if (!establishmentRepo) {
      return left(new EstablishmentNotFoundError())
    }

    let surveys: any = await this.repository.getAllEstablishmentSurvey(
      establishmentId
    )

    surveys = surveys.map((survey: SurveyEntity) => {
      const voteMap = new Map<string, MusicEntity & { votes: number }>()
      for (const vote of survey.pollVotes) {
        if (!voteMap.has(vote.chosenMusic.id)) {
          voteMap.set(vote.chosenMusic.id, {
            ...vote.chosenMusic,
            votes: 0
          })
        }

        const voteTrack = voteMap.get(vote.chosenMusic.id)
        voteTrack.votes += 1
        voteMap.set(vote.chosenMusic.id, voteTrack)
      }

      const votes = []
      for (const [, value] of voteMap) {
        votes.push(value)
      }

      return {
        ...survey,
        pollVotes: votes
      }
    })

    return right(surveys)
  }
}
