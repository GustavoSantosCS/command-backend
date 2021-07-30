/* eslint-disable no-param-reassign */
import { EstablishmentEntity } from '@/data/entities';
import {
  AddEstablishmentRepository,
  GetAllEstablishmentsUserRepository,
  GetEstablishmentByIdRepository,
  GetAllEstablishmentsRepository
} from '@/data/protocols';
import { TypeORMHelpers } from './typeorm-helper';

export class EstablishmentTypeOrmRepository
  implements
    AddEstablishmentRepository,
    GetAllEstablishmentsUserRepository,
    GetEstablishmentByIdRepository,
    GetAllEstablishmentsRepository
{
  async save(
    establishment: EstablishmentEntity
  ): Promise<AddEstablishmentRepository.Result> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const imageRepo = await queryRunner.manager.save(establishment.image);
      establishment.image = imageRepo;

      const establishmentRepo = await queryRunner.manager.save(establishment);

      await queryRunner.commitTransaction();
      return establishmentRepo;
    } catch (err) {
      // eslint-disable-next-line no-console
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
    establishmentId: string,
    config?: GetEstablishmentByIdRepository.Config
  ): Promise<GetEstablishmentByIdRepository.Result> {
    try {
      const establishmentRepository = await TypeORMHelpers.getRepository(
        EstablishmentEntity
      );
      let queryBuilder =
        establishmentRepository.createQueryBuilder('establishments');

      if (config?.withImage) {
        queryBuilder = queryBuilder.innerJoinAndSelect(
          'establishments.image',
          'establishment_image'
        );
      }

      if (config?.withManager) {
        queryBuilder = queryBuilder.innerJoinAndSelect(
          'establishments.manager',
          'users'
        );
      }

      queryBuilder = queryBuilder.where(
        'establishments.id = :establishmentId',
        { establishmentId }
      );

      const establishmentsUser = await queryBuilder.getOne();
      return establishmentsUser;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }

  async getAll(): Promise<EstablishmentEntity[]> {
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
