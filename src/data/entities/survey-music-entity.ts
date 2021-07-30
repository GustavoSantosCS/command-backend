import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MusicEntity } from './music-entity';
import { SurveyEntity } from './survey-entity';

@Entity('survey_music')
export class SurveyMusicEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  position: number;

  @ManyToOne(() => MusicEntity, music => music.surveyToMusic)
  @JoinColumn({ name: 'music_id' })
  music?: MusicEntity;

  @ManyToOne(() => SurveyEntity, survey => survey.surveyToMusic)
  @JoinColumn({ name: 'survey_id' })
  survey?: SurveyEntity;
}
