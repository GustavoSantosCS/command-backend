import {
  CloseSurveyRepository,
  GetSurveyByIdRepository
} from '@/data/protocols';
import { SurveyNotFoundError } from '@/domain/errors';
import { CloseSurveyUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBCloseSurvey implements CloseSurveyUseCase {
  private readonly getSurveyByIdRepo: GetSurveyByIdRepository;
  private readonly closeSurveyRepo: CloseSurveyRepository;

  constructor(
    getSurveyByIdRepo: GetSurveyByIdRepository,
    closeSurveyRepo: CloseSurveyRepository
  ) {
    this.closeSurveyRepo = closeSurveyRepo;
    this.getSurveyByIdRepo = getSurveyByIdRepo;
  }

  async closeSurvey(
    surveyId: string,
    userId: string
  ): Promise<CloseSurveyUseCase.Result> {
    const surveyRepo = await this.getSurveyByIdRepo.getById(surveyId, {
      includeEstablishmentAndManager: true,
      includeVotes: true
    });

    if (surveyRepo?.establishment.manager.id !== userId) {
      return left(new SurveyNotFoundError());
    }

    const { pollVotes } = surveyRepo;

    const closeSurvey = await this.closeSurveyRepo.remove(
      surveyRepo,
      pollVotes?.length !== 0
    );

    return closeSurvey ? right(closeSurvey) : left(new SurveyNotFoundError());
  }
}
