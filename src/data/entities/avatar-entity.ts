import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm'

import { UserEntity } from './user-entity'

@Entity('avatars')
export class AvatarEntity {
  @PrimaryColumn()
  persistentName: string

  @Column()
  originalName: string

  @Column()
  target: string

  @OneToOne(() => UserEntity, user => user.avatar)
  user: UserEntity
}
