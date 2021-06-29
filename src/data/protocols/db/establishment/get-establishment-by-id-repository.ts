import { EstablishmentEntity } from '@/data/entities';

export interface GetEstablishedByIdRepository {
  getById(id: string): Promise<EstablishmentEntity>;
}
