import { MusicEntity } from '@/data/entities'

export interface GetAllEstablishmentMusicsRepository {
  getAllEstablishmentMusics: (
    establishmentId: string
  ) => Promise<
  Array<Omit<
  MusicEntity,
  'establishment' | 'playlists' | 'surveys' | 'musicToPlaylist'
  >>
  >
}
