/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { MusicPlaylistEntity, PlaylistEntity } from '@/data/entities';
import {
  AddPlayListRepository,
  ClosesAllEstablishmentPlaylistsRepository,
  GetCurrentEstablishmentPlaylistRepository,
  GetPlaylistByIdRepository,
  UpdatePlaylistAndMusicsRepository,
  UpdatePlaylistRepository,
  SaveCurrentMusicPlaylistRepository
} from '@/data/protocols';
import { TypeORMHelpers } from './typeorm-helper';

export class PlaylistTypeOrmRepository
  implements
    AddPlayListRepository,
    GetCurrentEstablishmentPlaylistRepository,
    GetPlaylistByIdRepository,
    UpdatePlaylistRepository,
    ClosesAllEstablishmentPlaylistsRepository,
    UpdatePlaylistAndMusicsRepository,
    SaveCurrentMusicPlaylistRepository
{
  async add(
    playlist: PlaylistEntity,
    musics: MusicPlaylistEntity[]
  ): Promise<Omit<PlaylistEntity, 'establishment' | 'musics'>> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      let savePlaylist = await queryRunner.manager.save(playlist);
      const saveMusics = await Promise.all(
        musics.map(music => queryRunner.manager.save(music))
      );

      savePlaylist.currentMusic = saveMusics[0];
      savePlaylist = await queryRunner.manager.save(playlist);

      savePlaylist.musicToPlaylist = saveMusics.map(m => {
        delete m.playlist;
        delete m.music.establishment;
        delete m.music.createdAt;
        delete m.music.updatedAt;
        delete m.music.deletedAt;
        delete m.music.playlists;
        return m;
      });

      await queryRunner.commitTransaction();
      return savePlaylist;
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
    try {
      const queryBuilder = playlistRepo
        .createQueryBuilder('playlists')
        .innerJoin(
          'playlists.establishment',
          'establishments',
          'establishments.id = :establishmentId and playlists.isActive = :active',
          { active: true, establishmentId }
        );
      const playlist = await queryBuilder.getOne();
      const playlistComplete = await this.getPlaylistById(playlist.id, {
        includeCurrentMusic: true,
        includeMusicToPlaylist: true
      });
      return playlistComplete;
    } catch (err) {
      return null;
    }
  }

  async getPlaylistById(
    playlistId: string,
    strategy?: GetPlaylistByIdRepository.Config
  ): Promise<PlaylistEntity> {
    const playlistRepo = await TypeORMHelpers.getRepository(PlaylistEntity);
    if (!strategy) {
      return playlistRepo.findOne(playlistId);
    }

    let queryBuilder = playlistRepo.createQueryBuilder('playlists');

    if (strategy.includeMusicToPlaylist) {
      queryBuilder = queryBuilder
        .innerJoinAndSelect('playlists.musicToPlaylist', 'playlist_music')
        .innerJoinAndSelect('playlist_music.music', 'musics');
    }

    if (strategy.includeMusics) {
      queryBuilder = queryBuilder.innerJoinAndSelect(
        'playlists.musics',
        'musics'
      );
    }

    if (
      strategy.includeEstablishment ||
      strategy.includeEstablishmentAndManager
    ) {
      queryBuilder = queryBuilder.innerJoinAndSelect(
        'playlists.establishment',
        'establishments'
      );

      if (strategy.includeEstablishmentAndManager) {
        queryBuilder = queryBuilder.innerJoinAndSelect(
          'establishments.manager',
          'users'
        );
      }
    }

    let playlist = await queryBuilder
      .where('playlists.id = :playlistId', { playlistId })
      .getOne();

    if (strategy.includeCurrentMusic) {
      const { currentMusic } = await playlistRepo
        .createQueryBuilder('playlists')
        .innerJoinAndSelect('playlists.currentMusic', 'playlist_music')
        .innerJoinAndSelect('playlist_music.music', 'musics')
        .where('playlists.id = :playlistId', { playlistId })
        .getOne();
      playlist = Object.assign(playlist, { currentMusic });
    }

    return playlist;
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
      .set({ isActive: false })
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
      const trackedPlaylist = await this.getPlaylistById(playlist.id, {
        includeMusicToPlaylist: true
      });

      trackedPlaylist.currentMusic = null;
      await queryRunner.manager.save(trackedPlaylist);

      await Promise.all(
        trackedPlaylist.musicToPlaylist.map(musicToPlaylist =>
          queryRunner.manager.remove(musicToPlaylist)
        )
      );

      trackedPlaylist.musicToPlaylist = null;
      await queryRunner.manager.save(trackedPlaylist);

      trackedPlaylist.musicToPlaylist = await Promise.all(
        newMusics.map(music => queryRunner.manager.save(music))
      );

      trackedPlaylist.currentMusic = newMusics[0];
      await queryRunner.manager.save(trackedPlaylist);

      trackedPlaylist.musicToPlaylist = trackedPlaylist.musicToPlaylist.map(
        m => {
          delete m.playlist;
          delete m.music.establishment;
          delete m.music.createdAt;
          delete m.music.updatedAt;
          delete m.music.deletedAt;
          delete m.music.playlists;
          return m;
        }
      );

      await queryRunner.commitTransaction();
      return trackedPlaylist;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async saveCurrentMusicPlaylist(
    playlist: PlaylistEntity,
    newCurrentPlaylist: MusicPlaylistEntity
  ): Promise<MusicPlaylistEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const playlistToUpdate = await queryRunner.manager.findOne(
        PlaylistEntity,
        playlist.id
      );

      playlistToUpdate.currentMusic = newCurrentPlaylist;
      await queryRunner.manager.save(playlistToUpdate);
      newCurrentPlaylist = await queryRunner.manager.save(newCurrentPlaylist);

      await queryRunner.commitTransaction();
      return newCurrentPlaylist;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
