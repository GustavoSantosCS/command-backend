import { EstablishmentEntity } from '@/data/entities';

export interface GetAllEstablishmentsUserRepository {
  getAllEstablishmentsUser(userId: string): Promise<EstablishmentEntity[]>;
}
