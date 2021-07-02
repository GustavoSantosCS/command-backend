import { MusicModel } from '@/domain/models';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { EstablishmentEntity } from './establishment-entity';

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
