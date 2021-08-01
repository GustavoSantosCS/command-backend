import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('music_image')
export class MusicImageEntity {
  @PrimaryColumn()
  persistentName: string

  @Column()
  originalName: string

  @Column()
  target: string
}
