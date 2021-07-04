import { MusicModel } from '@/domain/models';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { EstablishmentEntity } from './establishment-entity';
import { PlaylistEntity } from './playlist-entity';

@Entity('musics')
export class MusicEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  talent: string;

  @Column()
  duration: number;

  @ManyToOne(() => EstablishmentEntity, establishment => establishment.musics)
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentEntity;

  @ManyToMany(() => PlaylistEntity, playlists => playlists.musics)
  @JoinTable({
    name: 'playlist_music',
    joinColumn: { name: 'idMusic' },
    inverseJoinColumn: { name: 'idPlaylist' }
  })
  playlists: PlaylistEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  constructor(music: MusicModel) {
    Object.assign(this, music);
  }
}
