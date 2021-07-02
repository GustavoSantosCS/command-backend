import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { AvatarModel } from '@/domain/models';
import { UserEntity } from './user-entity';

@Entity('avatars')
export class AvatarEntity {
  @PrimaryColumn()
  persistentName: string;

  @Column()
  originalName: string;

  @Column()
  target: string;

  @OneToOne(() => UserEntity, user => user.avatar, { onDelete: 'CASCADE' })
  user?: UserEntity;

  constructor(avatar: AvatarModel) {
    Object.assign(this, avatar);
  }
}
