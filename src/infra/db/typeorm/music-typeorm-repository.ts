import { EstablishmentEntity, MusicEntity } from '@/data/entities';
import {
  AddMusicRepository,
  GetAllEstablishmentMusicsRepository
} from '@/data/protocols';
import { MusicModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class MusicTypeOrmRepository
  implements AddMusicRepository, GetAllEstablishmentMusicsRepository
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
        establishmentId,
        {
          relations: ['musics']
        }
      );

      // create music entity
      const musicEntity = new MusicEntity(musicModel);
      musicEntity.establishment = trackedEstablishment;
      const persistentMusic = await queryRunner.manager.save(musicEntity);

      // Save establishment with the new product
      if (!trackedEstablishment.musics) {
        trackedEstablishment.musics = [];
      }
      trackedEstablishment.musics.push(persistentMusic);
      await queryRunner.manager.save(trackedEstablishment);

      await queryRunner.commitTransaction();

      delete persistentMusic.establishment;
      return persistentMusic;
    } catch (err) {
      console.error('MusicTypeOrmRepository:47 => ', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return null;
  }

  async getAllEstablishmentMusics(
    idEstablishment: string
  ): Promise<MusicEntity[]> {
    const productRepo = await TypeORMHelpers.getRepository(MusicEntity);

    const productsEntity = await productRepo
      .createQueryBuilder('musics')
      .innerJoinAndSelect('musics.establishment', 'establishments')
      .where('establishments.id = :id', { id: idEstablishment })
      .getMany();

    return productsEntity;
  }
}
