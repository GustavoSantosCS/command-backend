import { EstablishmentEntity } from '@/data/entities'

export interface GetAllEstablishmentsRepository {
  getAll: () => Promise<EstablishmentEntity[]>
}
