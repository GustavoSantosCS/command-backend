import { SurveyEntity } from '@/data/entities'

export interface AddSurveyRepository {
  save: (survey: SurveyEntity) => Promise<SurveyEntity>
}
