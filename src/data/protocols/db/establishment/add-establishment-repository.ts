import { EstablishmentEntity } from '@/data/entities';
import { EstablishmentModel } from '@/domain/models';

export interface AddEstablishmentRepository {
  save(
    userId: string,
    establishmentModel: EstablishmentModel
  ): Promise<EstablishmentEntity>;
}
