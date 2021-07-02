import { EstablishmentEntity, PlaylistEntity } from '@/data/entities';
import { AddPlayListRepository } from '@/data/protocols';
import { PlayListModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class PlaylistTypeOrmRepository implements AddPlayListRepository {
  async add(
    playlistModel: PlayListModel
  ): Promise<Omit<PlaylistEntity, 'establishment'>> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      // get establishment
      const establishment = await queryRunner.manager.findOne(
        EstablishmentEntity,
        playlistModel.establishment.id,
        {
          relations: ['playlists']
        }
      );

      let playlist = new PlaylistEntity(playlistModel);
      playlist.establishment = establishment;
      playlist = await queryRunner.manager.save(playlist);

      if (!establishment.playlists) establishment.playlists = [];
      establishment.playlists.push(playlist);
      await queryRunner.manager.save(establishment);

      await queryRunner.commitTransaction();
      delete playlist.establishment;
      return playlist;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('PlaylistTypeOrmRepository:35 => ', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return null;
  }
}
