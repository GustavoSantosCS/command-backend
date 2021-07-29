import { GetSurveyByIdRepository } from '@/data/protocols';
import { SurveyNotFoundError } from '@/domain/errors';
import { GetSurveyByIdUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBGetSurveyById implements GetSurveyByIdUseCase {
  private readonly getSurveyByIdRepo: GetSurveyByIdRepository;

  constructor(getSurveyByIdRepo: GetSurveyByIdRepository) {
    this.getSurveyByIdRepo = getSurveyByIdRepo;
  }

  async getSurveyById({
    surveyId,
    userId
  }: GetSurveyByIdUseCase.Param): Promise<GetSurveyByIdUseCase.Result> {
    const trackedSurvey = await this.getSurveyByIdRepo.getById(surveyId, {
      includeEstablishmentAndManager: true,
      includeSurveyToMusic: true
      // includeVotes: true // TODO: modificar quando for adiciona o suporte ao votos
    });

    if (!trackedSurvey || trackedSurvey?.establishment.manager.id !== userId) {
      return left(new SurveyNotFoundError());
    }

    delete trackedSurvey.establishment;

    return right(trackedSurvey);
  }
}
