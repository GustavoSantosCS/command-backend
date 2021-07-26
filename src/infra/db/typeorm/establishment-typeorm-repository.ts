import {
  EstablishmentEntity,
  EstablishmentImageEntity,
  UserEntity
} from '@/data/entities';
import {
  AddEstablishmentRepository,
  GetAllEstablishmentsUserRepository,
  GetEstablishmentByIdRepository,
  GetAllEstablishmentsRepository
} from '@/data/protocols';
import { EstablishmentModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class EstablishmentTypeOrmRepository
  implements
    AddEstablishmentRepository,
    GetAllEstablishmentsUserRepository,
    GetEstablishmentByIdRepository,
    GetAllEstablishmentsRepository
{
  async save(
    userId: string,
    establishmentModel: EstablishmentModel
  ): Promise<AddEstablishmentRepository.Result> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const userEntity = await queryRunner.manager.findOne(UserEntity, userId);
      let imageEntity = new EstablishmentImageEntity(establishmentModel.image);

      imageEntity = await queryRunner.manager.save(imageEntity);
      let establishmentEntity = new EstablishmentEntity(establishmentModel);
      establishmentEntity.image = imageEntity;
      establishmentEntity.manager = userEntity;
      establishmentEntity = await queryRunner.manager.save(establishmentEntity);

      await queryRunner.commitTransaction();

      delete establishmentEntity.manager;
      delete establishmentEntity.products;
      delete establishmentEntity.playlists;
      delete establishmentEntity.accounts;
      delete establishmentEntity.surveys;
      delete establishmentEntity.musics;
      delete establishmentEntity.deletedAt;
      return establishmentEntity;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('EstablishmentTypeOrmRepository:31 => ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllEstablishmentsUser(
    userId: string
  ): Promise<GetAllEstablishmentsUserRepository.Result> {
    const establishmentRepository = await TypeORMHelpers.getRepository(
      EstablishmentEntity
    );

    const query = establishmentRepository
      .createQueryBuilder('establishments')
      .innerJoin('establishments.manager', 'users')
      .innerJoinAndSelect('establishments.image', 'establishment_image')
      .orderBy('establishments.name', 'ASC')
      .where('users.id = :id', { id: userId });

    const establishmentsUser = await query.getMany();

    return establishmentsUser;
  }

  async getById(
    establishmentId: string
  ): Promise<GetEstablishmentByIdRepository.Result> {
    try {
      const establishmentRepository = await TypeORMHelpers.getRepository(
        EstablishmentEntity
      );
      const query = establishmentRepository
        .createQueryBuilder('establishments')
        .innerJoinAndSelect('establishments.manager', 'users')
        .innerJoinAndSelect('establishments.image', 'establishment_image')
        .where('establishments.id = :establishmentId', { establishmentId });
      const establishmentsUser = await query.getOne();
      return establishmentsUser;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('EstablishmentTypeOrmRepository:getById => ', error);
      throw error;
    }
  }

  async getAllEstablishments(): Promise<EstablishmentEntity[]> {
    const establishmentRepo = await TypeORMHelpers.getRepository(
      EstablishmentEntity
    );

    const establishments = establishmentRepo
      .createQueryBuilder('establishments')
      .innerJoinAndSelect('establishments.image', 'establishment_image')
      .orderBy('establishments.name', 'ASC')
      .getMany();
    return establishments;
  }
}
