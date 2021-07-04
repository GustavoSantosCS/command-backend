/* eslint-disable no-param-reassign */
import {
  EstablishmentEntity,
  MusicEntity,
  PlaylistEntity
} from '@/data/entities';
import {
  AddPlayListRepository,
  GetCurrentEstablishedPlaylistRepository
} from '@/data/protocols';
import { PlayListModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class PlaylistTypeOrmRepository
  implements AddPlayListRepository, GetCurrentEstablishedPlaylistRepository
{
  async add(
    newPlaylist: PlayListModel,
    musics: { id: string }[]
  ): Promise<PlaylistEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      // get establishment
      const establishment = await queryRunner.manager.findOne(
        EstablishmentEntity,
        newPlaylist.establishment.id,
        {
          relations: ['playlists']
        }
      );

      // Save playlist
      const playlist = new PlaylistEntity(newPlaylist);
      playlist.establishment = establishment; // Link playlist to establishment
      await queryRunner.manager.save(playlist);

      // Link music to playlists
      // eslint-disable-next-line no-restricted-syntax
      for await (const music of musics) {
        const trackedMusic = await queryRunner.manager.findOne(
          MusicEntity,
          music.id,
          {
            relations: ['playlists', 'establishment']
          }
        );

        trackedMusic.playlists.push(playlist);
        playlist.musics.push(trackedMusic);

        await queryRunner.manager.save(trackedMusic);
      }

      // Link playlists to establishment
      establishment.playlists.push(playlist);
      await queryRunner.manager.save(establishment);
      await queryRunner.commitTransaction();
      delete playlist.establishment;
      playlist.musics = playlist.musics.map(music => {
        delete music.playlists;
        delete music.establishment;
        delete music.createdAt;
        delete music.updatedAt;
        delete music.deletedAt;
        return music;
      });

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

  async getEstablishedPlaylist(
    establishmentId: string
  ): Promise<PlaylistEntity> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);

    const queryBuilder = playlistRepo
      .createQueryBuilder('playlists')
      .innerJoinAndSelect(
        'playlists.establishment',
        'establishments',
        'establishments.id = :establishmentId and playlists.isActive = :ative',
        { ative: true, establishmentId }
      )
      .innerJoinAndSelect('playlists.musics', 'musics.id');

    // eslint-disable-next-line no-console
    const playlist = await queryBuilder.getOne();

    playlist.musics = playlist.musics.map(music => {
      delete music.playlists;
      delete music.establishment;
      delete music.createdAt;
      delete music.updatedAt;
      delete music.deletedAt;
      return music;
    });

    return playlist;
  }
}
