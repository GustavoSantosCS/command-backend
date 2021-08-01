import { MusicEntity } from '@/data/entities'
import {
  AddMusicRepository,
  GetAllEstablishmentMusicsRepository,
  GetMusicByIdRepository
} from '@/data/protocols'
import { TypeORMHelpers } from './typeorm-helper'

export class MusicTypeOrmRepository
  implements
    AddMusicRepository,
    GetAllEstablishmentMusicsRepository,
    GetMusicByIdRepository
{
  async save(newMusic: MusicEntity): Promise<MusicEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const imageRepo = await queryRunner.manager.save(newMusic.image)
      newMusic.image = imageRepo
      const musicRepo = await queryRunner.manager.save(newMusic)
      await queryRunner.commitTransaction()
      delete musicRepo.establishment
      return musicRepo
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async getAllEstablishmentMusics(
    establishmentId: string
  ): Promise<MusicEntity[]> {
    const productRepo = await TypeORMHelpers.getRepository(MusicEntity)

    const productsEntity = await productRepo
      .createQueryBuilder('musics')
      .innerJoinAndSelect('musics.image', 'music_image')
      .innerJoin('musics.establishment', 'establishments')
      .where('establishments.id = :id', { id: establishmentId })
      .orderBy('musics.name', 'ASC')
      .getMany()

    return productsEntity
  }

  async getById(musicId: string): Promise<MusicEntity> {
    const musicRepo = await TypeORMHelpers.getRepository(MusicEntity)
    const musicEntity = await musicRepo
      .createQueryBuilder('musics')
      .innerJoinAndSelect('musics.image', 'music_image')
      .innerJoinAndSelect('musics.establishment', 'establishments')
      .innerJoinAndSelect('establishments.manager', 'users')
      .where('musics.id = :musicId', { musicId })
      .getOne()
    return musicEntity
  }
}
