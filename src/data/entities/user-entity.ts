import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { UserModel } from '@/domain/models';
import { AvatarEntity } from './avatar-entity';
import { EstablishmentEntity } from './establishment-entity';

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

  @OneToOne(() => AvatarEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  avatar?: AvatarEntity;

  @OneToMany(() => EstablishmentEntity, establishment => establishment.manager)
  establishments?: EstablishmentEntity[];

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
