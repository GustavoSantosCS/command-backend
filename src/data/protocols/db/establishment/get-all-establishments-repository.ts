import { EstablishmentEntity } from '@/data/entities';

export interface GetAllEstablishmentsRepository {
  getAllEstablishments(): Promise<EstablishmentEntity[]>;
}
