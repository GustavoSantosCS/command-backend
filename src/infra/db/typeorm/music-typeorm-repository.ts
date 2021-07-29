import { EstablishmentEntity, MusicEntity } from '@/data/entities';
import {
  AddMusicRepository,
  GetAllEstablishmentMusicsRepository,
  GetMusicByIdRepository
} from '@/data/protocols';
import { MusicModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class MusicTypeOrmRepository
  implements
    AddMusicRepository,
    GetAllEstablishmentMusicsRepository,
    GetMusicByIdRepository
{
  async add(
    musicModel: MusicModel,
    establishmentId: string
  ): Promise<MusicEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      // get establishment
      const trackedEstablishment = await queryRunner.manager.findOne(
        EstablishmentEntity,
        establishmentId
      );

      // create music entity
      const musicEntity = new MusicEntity(musicModel);
      musicEntity.establishment = trackedEstablishment;
      const persistentMusic = await queryRunner.manager.save(musicEntity);

      await queryRunner.commitTransaction();

      delete persistentMusic.establishment;
      return persistentMusic;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('MusicTypeOrmRepository:47 => ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllEstablishmentMusics(
    establishmentId: string
  ): Promise<MusicEntity[]> {
    const productRepo = await TypeORMHelpers.getRepository(MusicEntity);

    const productsEntity = await productRepo
      .createQueryBuilder('musics')
      .innerJoin('musics.establishment', 'establishments')
      .where('establishments.id = :id', { id: establishmentId })
      .orderBy('musics.name', 'ASC')
      .getMany();

    return productsEntity;
  }

  async getById(musicId: string): Promise<MusicEntity> {
    const musicRepo = await TypeORMHelpers.getRepository(MusicEntity);
    const musicEntity = await musicRepo
      .createQueryBuilder('musics')
      .innerJoinAndSelect('musics.establishment', 'establishments')
      .innerJoinAndSelect('establishments.manager', 'users')
      .where('musics.id = :musicId', { musicId })
      .getOne();
    return musicEntity;
  }
}
