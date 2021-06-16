import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { UserModel } from '@/domain/models';
import { AvatarEntity } from './avatar-entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(type => AvatarEntity)
  @JoinColumn()
  avatar?: AvatarEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  @DeleteDateColumn({ name: 'delete_at' })
  deleteAt: Date;

  constructor(user: UserModel) {
    Object.assign(this, user);
  }
}
