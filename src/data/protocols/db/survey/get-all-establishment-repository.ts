import { SurveyEntity } from '@/data/entities'

export interface GetAllEstablishmentSurveyRepository {
  getAllEstablishmentSurvey: (
    establishmentId: string
  ) => Promise<SurveyEntity[]>
}
