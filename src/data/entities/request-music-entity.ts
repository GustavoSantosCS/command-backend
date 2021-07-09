import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { AccountEntity } from './account-entity';
import { MusicEntity } from './music-entity';

@Entity('request_music')
export class RequestMusicEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => AccountEntity, account => account.requestsProduct)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @ManyToOne(() => MusicEntity)
  @JoinColumn({ name: 'music_id' })
  music: MusicEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
