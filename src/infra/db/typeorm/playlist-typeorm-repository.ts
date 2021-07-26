/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import {
  EstablishmentEntity,
  MusicPlaylistEntity,
  PlaylistEntity
} from '@/data/entities';
import {
  AddPlayListRepository,
  GetCurrentEstablishmentPlaylistRepository
} from '@/data/protocols';
import { PlayListModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class PlaylistTypeOrmRepository
  implements AddPlayListRepository, GetCurrentEstablishmentPlaylistRepository
{
  async add(
    data: AddPlayListRepository.Params,
    establishmentId: string,
    playlistModel: PlayListModel
  ): Promise<PlaylistEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      const establishment = await queryRunner.manager.findOne(
        EstablishmentEntity,
        establishmentId
      );

      let playlist = new PlaylistEntity(playlistModel);
      playlist.establishment = establishment;
      playlist = await queryRunner.manager.save(playlist);
      playlist.musics = [];
      for await (const playlistMusic of data) {
        let playlistMusicEntity = new MusicPlaylistEntity(
          playlistMusic.id,
          playlistMusic.music,
          playlistMusic.playlist,
          playlistMusic.position
        );
        playlistMusicEntity = await queryRunner.manager.save(
          playlistMusicEntity
        );
        playlist.musics.push(playlistMusicEntity.music);
      }

      await queryRunner.commitTransaction();

      return playlist;
    } catch (err) {
      console.error('PlaylistTypeOrmRepository:35 => ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getEstablishmentPlaylist(
    establishmentId: string
  ): Promise<PlaylistEntity> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);

    const queryBuilder = playlistRepo
      .createQueryBuilder('playlists')
      .innerJoin(
        'playlists.establishment',
        'establishments',
        'establishments.id = :establishmentId and playlists.isActive = :ative',
        { ative: true, establishmentId }
      )
      .innerJoinAndSelect('playlists.musics', 'musics.id');

    const playlist = await queryBuilder.getOne();

    return playlist;
  }

  async getPlaylistById(id: string): Promise<PlaylistEntity> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);
    const musicRepo = await TypeORMHelpers.getRepository(MusicPlaylistEntity);

    const playlist = await playlistRepo.findOne(id, {
      relations: ['musicToPlaylist']
    });

    for await (const music of playlist.musicToPlaylist) {
      const musicTrack = await musicRepo.findOne(music.id, {
        relations: ['music']
      });
      const musicClean = {
        id: musicTrack.music.id,
        name: musicTrack.music.name,
        talent: musicTrack.music.talent,
        duration: musicTrack.music.duration
      };
      music.music = musicClean as any;
    }

    return playlist;
  }
}
