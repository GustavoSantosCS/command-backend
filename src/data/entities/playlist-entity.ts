import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { EstablishmentEntity } from './establishment-entity'
import { MusicEntity } from './music-entity'
import { MusicPlaylistEntity } from './music-playlist-entity'

@Entity('playlists')
export class PlaylistEntity {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  isActive: boolean

  @ManyToMany(() => MusicEntity, musics => musics.playlists)
  @JoinTable({
    name: 'playlist_music',
    joinColumn: { name: 'playlist_id' },
    inverseJoinColumn: { name: 'music_id' }
  })
  musics: MusicEntity[]

  @ManyToOne(() => EstablishmentEntity, establishment => establishment.musics)
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentEntity

  @OneToMany(
    () => MusicPlaylistEntity,
    musicToPlaylist => musicToPlaylist.playlist
  )
  musicToPlaylist!: MusicPlaylistEntity[]

  @ManyToOne(() => MusicPlaylistEntity)
  @JoinColumn({ name: 'current_music_id' })
  currentMusic!: MusicPlaylistEntity

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date
}
