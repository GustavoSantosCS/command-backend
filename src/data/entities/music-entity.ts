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
import { MusicModel } from '@/domain/models';
import { EstablishmentEntity } from './establishment-entity';
import { MusicPlaylistEntity } from './music-playlist-entity';
import { PlaylistEntity } from './playlist-entity';
import { SurveyEntity } from './survey-entity';
import { SurveyMusicEntity } from './survey-music-entity';

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

  @ManyToMany(() => SurveyEntity, surveys => surveys.musics)
  @JoinTable({
    name: 'survey_music',
    joinColumn: { name: 'idMusic' },
    inverseJoinColumn: { name: 'idSurvey' }
  })
  surveys?: SurveyEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(
    () => MusicPlaylistEntity,
    musicToPlaylist => musicToPlaylist.music
  )
  musicToPlaylist?: MusicPlaylistEntity[];

  @OneToMany(() => SurveyMusicEntity, surveyToMusic => surveyToMusic.music)
  surveyToMusic?: SurveyMusicEntity[];

  constructor(music?: MusicModel) {
    if (music) Object.assign(this, music);
  }
}
