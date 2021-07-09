import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { MusicEntity } from './music-entity';
import { SurveyEntity } from './survey-entity';
import { UserEntity } from './user-entity';

@Entity('vote')
export class VoteEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => MusicEntity)
  @JoinColumn({ name: 'id_chosen_music' })
  chosenMusic?: MusicEntity;

  @ManyToOne(() => SurveyEntity, survey => survey.pollVotes)
  @JoinColumn({ name: 'id_survey' })
  survey?: SurveyEntity;

  @ManyToOne(() => UserEntity, user => user.pollVotes)
  @JoinColumn({ name: 'id_client' })
  client?: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
