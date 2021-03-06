import { GetSurveyByIdRepository } from '@/data/protocols'
import { SurveyNotFoundError } from '@/domain/errors'
import { GetSurveyByIdUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBGetSurveyById implements GetSurveyByIdUseCase {
  private readonly getSurveyByIdRepo: GetSurveyByIdRepository

  constructor(getSurveyByIdRepo: GetSurveyByIdRepository) {
    this.getSurveyByIdRepo = getSurveyByIdRepo
  }

  async getById(surveyId: string): Promise<GetSurveyByIdUseCase.Result> {
    const trackedSurvey = await this.getSurveyByIdRepo.getById(
      surveyId,
      {
        withSurveyToMusic: true,
        withVotes: true
      },
      true
    )

    if (!trackedSurvey) {
      return left(new SurveyNotFoundError())
    }

    return right(trackedSurvey)
  }
}
