/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import {
  EstablishmentEntity,
  MusicEntity,
  MusicPlaylistEntity,
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
    musics: { id: string; position: number }[]
  ): Promise<PlaylistEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      const establishment = await queryRunner.manager.findOne(
        EstablishmentEntity,
        newPlaylist.establishment.id,
        {
          relations: ['playlists']
        }
      );

      const playlist = new PlaylistEntity(newPlaylist);
      playlist.establishment = establishment;
      await queryRunner.manager.save(playlist);

      playlist.musics = [];
      for await (const music of musics) {
        const trackedMusic = await queryRunner.manager.findOne(
          MusicEntity,
          music.id
        );

        const musicPlaylist = new MusicPlaylistEntity(
          trackedMusic,
          playlist,
          music.position
        );

        playlist.musics.push({
          id: trackedMusic.id,
          name: trackedMusic.name,
          talent: trackedMusic.talent,
          duration: trackedMusic.duration
        } as any);
        await queryRunner.manager.save(musicPlaylist);
      }
      establishment.playlists.push(playlist);
      await queryRunner.manager.save(establishment);
      await queryRunner.commitTransaction();

      return playlist;
    } catch (err) {
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
