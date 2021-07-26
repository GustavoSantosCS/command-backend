import { SurveyEntity } from '@/data/entities';
import { SurveyModel } from '@/domain/models';

export interface AddSurveyRepository {
  addSurvey(survey: SurveyModel): Promise<SurveyEntity>;
}
