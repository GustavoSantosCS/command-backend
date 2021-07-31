import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm'
import { MusicEntity } from './music-entity'
import { SurveyEntity } from './survey-entity'
import { UserEntity } from './user-entity'

@Entity('votes')
export class VoteEntity {
  @PrimaryColumn()
  id: string

  @ManyToOne(() => MusicEntity)
  @JoinColumn({ name: 'music_id' })
  chosenMusic?: MusicEntity

  @ManyToOne(() => SurveyEntity, survey => survey.pollVotes)
  @JoinColumn({ name: 'survey_id' })
  survey: SurveyEntity

  @ManyToOne(() => UserEntity, user => user.pollVotes)
  @JoinColumn({ name: 'client_id' })
  client: UserEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
