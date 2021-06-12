import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AvatarModel } from '@/domain/models';

@Entity('avatars')
export class AvatarEntity {
  @PrimaryColumn()
  persistentName: string;

  @Column()
  originalName: string;

  @Column()
  target: string;

  constructor(avatar: AvatarModel) {
    Object.assign(this, avatar);
  }
}
