export interface ClosesAllEstablishmentPlaylistsRepository {
  closesAllEstablishmentPlaylist: (establishmentId: string) => Promise<void>
}
