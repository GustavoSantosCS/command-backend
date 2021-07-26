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
  ClosesAllEstablishmentPlaylistsRepository,
  GetCurrentEstablishmentPlaylistRepository,
  GetPlaylistByIdRepository,
  UpdatePlaylistAndMusicsRepository,
  UpdatePlaylistRepository
} from '@/data/protocols';
import { PlayListModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class PlaylistTypeOrmRepository
  implements
    AddPlayListRepository,
    GetCurrentEstablishmentPlaylistRepository,
    GetPlaylistByIdRepository,
    UpdatePlaylistRepository,
    ClosesAllEstablishmentPlaylistsRepository,
    UpdatePlaylistAndMusicsRepository
{
  async add(
    data: AddPlayListRepository.Params,
    establishmentId: string,
    playlistModel: PlayListModel
  ): Promise<Omit<PlaylistEntity, 'establishment' | 'musicToPlaylist'>> {
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
      delete playlist.establishment;
      delete playlist.musicToPlaylist;
      return playlist;
    } catch (err) {
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

  async getPlaylistById(
    playlistId: string,
    strategy: GetPlaylistByIdRepository.Config
  ): Promise<PlaylistEntity> {
    let playlist = null;

    if (strategy.includeEstablishmentAndManager) {
      playlist = await this.getPlaylistByIdAndEstablishmentAndManager(
        playlistId
      );
    } else if (strategy.includeMusics) {
      playlist = await this.getPlaylistAndMusic(playlistId);
    } else if (strategy.includeEstablishmentAndManager) {
      playlist = await this.getPlaylistByIdAndEstablishment(playlistId);
    } else {
      playlist = await (
        await TypeORMHelpers.getRepository(PlaylistEntity)
      ).findOne(playlistId);
    }

    return playlist;
  }

  private async getPlaylistByIdAndEstablishment(
    playlistId: string
  ): Promise<PlaylistEntity> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);
    const playlist = await playlistRepo
      .createQueryBuilder('playlists')
      .innerJoinAndSelect('playlists.establishment', 'establishments')
      .where('playlists.id = :playlistId', { playlistId })
      .getOne();

    return playlist;
  }

  private async getPlaylistByIdAndEstablishmentAndManager(
    playlistId: string
  ): Promise<PlaylistEntity> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);

    const playlist = await playlistRepo
      .createQueryBuilder('playlists')
      .innerJoinAndSelect('playlists.establishment', 'establishments')
      .innerJoinAndSelect('establishments.manager', 'users')
      .where('playlists.id = :playlistId', { playlistId })
      .getOne();

    return playlist;
  }

  private async getPlaylistAndMusic(
    playlistId: string
  ): Promise<PlaylistEntity> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);
    const musicRepo = await TypeORMHelpers.getRepository(MusicPlaylistEntity);

    const playlist = await playlistRepo.findOne(playlistId, {
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

  async updatePlaylistAndMusics(
    newDate: PlaylistEntity
  ): Promise<UpdatePlaylistRepository.Result> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);
    const updatePlaylist = await playlistRepo.save(newDate);
    return updatePlaylist;
  }

  async updatePlaylist(
    newDate: PlaylistEntity
  ): Promise<UpdatePlaylistRepository.Result> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);
    const updatePlaylist = await playlistRepo.save(newDate);
    return updatePlaylist;
  }

  async closesAllEstablishmentPlaylist(establishmentId: string): Promise<void> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);
    await playlistRepo
      .createQueryBuilder()
      .update(PlaylistEntity)
      .set({
        isActive: false
      })
      .where('establishment = :establishmentId', { establishmentId })
      .execute();
  }

  async updateMusicsOfPlaylist(
    playlist: PlaylistEntity,
    newMusics: MusicPlaylistEntity[]
  ): Promise<UpdatePlaylistAndMusicsRepository.Result> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      console.log('oooo', playlist.id);
      const trackedPlaylist = await queryRunner.manager.findOne(
        PlaylistEntity,
        playlist.id,
        { relations: ['musicToPlaylist'] }
      );

      await Promise.all(
        trackedPlaylist.musicToPlaylist.map(musicToPlaylist =>
          queryRunner.manager.remove(musicToPlaylist)
        )
      );

      const trackedMusic = await Promise.all(
        newMusics.map(music => queryRunner.manager.save(music))
      );
      playlist.musicToPlaylist = trackedMusic.map(m => {
        delete m.playlist;
        delete m.music.establishment;
        delete m.music.createdAt;
        delete m.music.updatedAt;
        delete m.music.deletedAt;
        delete m.music.playlists;
        return m;
      });

      await queryRunner.commitTransaction();
      return playlist;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
