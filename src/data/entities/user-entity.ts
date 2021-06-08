import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { UserModel } from '@/domain/models';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  password: string;

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
