import { MusicModel, PlayListModel } from '@/domain/models';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { EstablishmentEntity } from './establishment-entity';
import { MusicEntity } from './music-entity';
import { MusicPlaylistEntity } from './music-playlist-entity';

@Entity('playlists')
export class PlaylistEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  isActive: boolean;

  @ManyToMany(() => MusicEntity, musics => musics.playlists)
  @JoinTable({
    name: 'playlist_music',
    inverseJoinColumn: { name: 'idMusic' },
    joinColumn: { name: 'idPlaylist' }
  })
  musics: MusicEntity[];

  @ManyToOne(() => EstablishmentEntity, establishment => establishment.musics)
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => MusicPlaylistEntity,
    musicToPlaylist => musicToPlaylist.playlist
  )
  public musicToPlaylist!: MusicPlaylistEntity[];

  constructor(playlistModel: PlayListModel) {
    Object.assign(this, playlistModel);
  }
}