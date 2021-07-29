import { SurveyEntity } from '@/data/entities';

export interface AddSurveyRepository {
  addSurvey(survey: SurveyEntity): Promise<SurveyEntity>;
}
