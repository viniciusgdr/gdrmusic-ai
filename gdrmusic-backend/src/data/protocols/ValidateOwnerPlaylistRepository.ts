export interface ValidateOwnerPlaylistRepository {
  validate: (playlistId: string, userId: string) => Promise<boolean>
}
