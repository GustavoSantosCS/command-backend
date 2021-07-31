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
} from 'typeorm'
import { AvatarEntity } from './avatar-entity'
import { EstablishmentEntity } from './establishment-entity'
import { VoteEntity } from './vote-entity'
import { AccountEntity } from './account-entity'

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @OneToOne(() => AvatarEntity, avatar => avatar.user)
  @JoinColumn({ name: 'avatar' })
  avatar?: AvatarEntity

  @OneToMany(() => EstablishmentEntity, establishment => establishment.manager)
  establishments?: EstablishmentEntity[]

  @OneToMany(() => AccountEntity, account => account.client)
  accounts?: AccountEntity[]

  @OneToMany(() => VoteEntity, vote => vote.client)
  pollVotes?: VoteEntity[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
