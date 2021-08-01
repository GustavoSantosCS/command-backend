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
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { EstablishmentEntity } from './establishment-entity'
import { MusicImageEntity } from './music-image-entity'
import { MusicPlaylistEntity } from './music-playlist-entity'
import { PlaylistEntity } from './playlist-entity'
import { SurveyEntity } from './survey-entity'
import { SurveyMusicEntity } from './survey-music-entity'

@Entity('musics')
export class MusicEntity {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  talent: string

  @Column()
  duration: number

  @ManyToOne(() => EstablishmentEntity, establishment => establishment.musics)
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentEntity

  @OneToOne(() => MusicImageEntity)
  @JoinColumn({ name: 'image' })
  image: MusicImageEntity

  @ManyToMany(() => PlaylistEntity, playlists => playlists.musics)
  @JoinTable({
    name: 'playlist_music',
    joinColumn: { name: 'music_id' },
    inverseJoinColumn: { name: 'playlist_' }
  })
  playlists: PlaylistEntity[]

  @ManyToMany(() => SurveyEntity, surveys => surveys.musics)
  @JoinTable({
    name: 'survey_music',
    joinColumn: { name: 'music_id' },
    inverseJoinColumn: { name: 'survey_id' }
  })
  surveys?: SurveyEntity[]

  @OneToMany(
    () => MusicPlaylistEntity,
    musicToPlaylist => musicToPlaylist.music
  )
  musicToPlaylist?: MusicPlaylistEntity[]

  @OneToMany(() => SurveyMusicEntity, surveyToMusic => surveyToMusic.music)
  surveyToMusic?: SurveyMusicEntity[]

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt?: Date
}
