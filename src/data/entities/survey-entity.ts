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
} from 'typeorm'
import { EstablishmentEntity } from './establishment-entity'
import { MusicEntity } from './music-entity'
import { SurveyMusicEntity } from './survey-music-entity'
import { VoteEntity } from './vote-entity'

@Entity('surveys')
export class SurveyEntity {
  @PrimaryColumn()
  id: string

  @ManyToOne(() => EstablishmentEntity, establishment => establishment.surveys)
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentEntity

  @ManyToMany(() => MusicEntity, musics => musics.surveys)
  @JoinTable({
    name: 'survey_music',
    joinColumn: { name: 'survey_id' },
    inverseJoinColumn: { name: 'music_id' }
  })
  musics: MusicEntity[]

  @Column()
  question: string

  @OneToMany(() => VoteEntity, vote => vote.survey)
  pollVotes?: VoteEntity[]

  @OneToMany(() => SurveyMusicEntity, surveyToMusic => surveyToMusic.survey)
  surveyToMusic?: SurveyMusicEntity[]

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date

  @DeleteDateColumn({ name: 'closed_at', select: false })
  closedAt: Date
}
