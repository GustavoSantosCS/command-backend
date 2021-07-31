import { SurveyEntity } from '@/data/entities'

export interface CloseSurveyRepository {
  remove: (survey: SurveyEntity, softDelete: boolean) => Promise<SurveyEntity>
}
