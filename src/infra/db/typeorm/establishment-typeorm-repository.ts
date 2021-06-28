import {
  EstablishmentEntity,
  EstablishmentImageEntity,
  UserEntity
} from '@/data/entities';
import {
  AddEstablishmentRepository,
  GetAllEstablishmentsUserRepository
} from '@/data/protocols';
import { EstablishmentModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class EstablishmentTypeOrmRepository
  implements AddEstablishmentRepository, GetAllEstablishmentsUserRepository
{
  async save(
    userId: string,
    establishmentModel: EstablishmentModel
  ): Promise<EstablishmentEntity> {
    const userRep = await TypeORMHelpers.getRepository(UserEntity);
    const establishmentRepo = await TypeORMHelpers.getRepository(
      EstablishmentEntity
    );
    const imageRepo = await TypeORMHelpers.getRepository(
      EstablishmentImageEntity
    );

    const newImageEntity = new EstablishmentImageEntity(
      establishmentModel.image
    );
    const trackImage = await imageRepo.save(newImageEntity);

    const newEstablishmentEntity = new EstablishmentEntity(establishmentModel);
    newEstablishmentEntity.image = trackImage;
    const trackEstablishment = await establishmentRepo.save(
      newEstablishmentEntity
    );

    const userEntity = await userRep.findOne(userId, {
      relations: ['establishments']
    });
    if (!userEntity.establishments) {
      userEntity.establishments = [];
    }
    userEntity.establishments.push(trackEstablishment);
    await userRep.save(userEntity);

    return trackEstablishment;
  }

  async getAllEstablishmentsUser(
    userId: string
  ): Promise<EstablishmentEntity[]> {
    const establishmentRepository = await TypeORMHelpers.getRepository(
      EstablishmentEntity
    );

    const query = establishmentRepository
      .createQueryBuilder('establishments')
      .innerJoinAndSelect('establishments.manager', 'users')
      .innerJoinAndSelect('establishments.image', 'establishment_image')
      .where('users.id = :id', { id: userId });

    // console.log(query.getSql());

    const establishmentsUser = await query.getMany();

    return establishmentsUser;
  }
}
