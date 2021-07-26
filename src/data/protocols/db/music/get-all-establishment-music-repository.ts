import { MusicEntity } from '@/data/entities';

export interface GetAllEstablishmentMusicsRepository {
  getAllEstablishmentMusics(
    establishmentId: string
  ): Promise<
    Omit<
      MusicEntity,
      'establishment' | 'playlists' | 'surveys' | 'musicToPlaylist'
    >[]
  >;
}
