import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { MusicEntity } from './music-entity';
import { PlaylistEntity } from './playlist-entity';

@Entity('playlist_music')
export class MusicPlaylistEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  position: number;

  @Column()
  alreadyTouched: boolean;

  @Column()
  isPlay: boolean;

  @ManyToOne(() => MusicEntity, music => music.musicToPlaylist)
  @JoinColumn({ name: 'idMusic' })
  music?: MusicEntity;

  @ManyToOne(() => PlaylistEntity, playlist => playlist.musicToPlaylist)
  @JoinColumn({ name: 'idPlaylist' })
  playlist?: PlaylistEntity;

  constructor(music: MusicEntity, playlist: PlaylistEntity, position: number) {
    this.id = uuid();
    this.position = position;
    this.music = music;
    this.playlist = playlist;
    this.isPlay = false;
    this.alreadyTouched = false;
  }
}
