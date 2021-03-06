import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { MusicEntity } from './music-entity'
import { PlaylistEntity } from './playlist-entity'

@Entity('playlist_music')
export class MusicPlaylistEntity {
  @PrimaryColumn()
  id: string

  @Column()
  position: number

  @Column()
  isPlay: boolean

  @ManyToOne(() => MusicEntity, music => music.musicToPlaylist)
  @JoinColumn({ name: 'music_id' })
  music: MusicEntity

  @ManyToOne(() => PlaylistEntity, playlist => playlist.musicToPlaylist)
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity

  constructor (
    id: string,
    music: MusicEntity,
    playlist: PlaylistEntity,
    position: number
  ) {
    this.id = id
    this.position = position
    this.music = music
    this.playlist = playlist
    this.isPlay = false
  }
}
