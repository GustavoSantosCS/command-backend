import { PlaylistEntity } from '@/data/entities'

export interface GetCurrentEstablishmentPlaylistRepository {
  getCurrentEstablishmentPlaylist: (
    establishmentId: string
  ) => Promise<Omit<PlaylistEntity, 'establishment' | 'musics'>>
}
