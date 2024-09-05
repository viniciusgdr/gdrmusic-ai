import { Playlist } from '@gdrmusic/models/playlist'

export const updateMusicPlaylist = async ({
  playlistId,
  musicId,
  type
}: {
  playlistId: string
  musicId: string
  type: 'ADD' | 'REMOVE'
}): Promise<{
  status: number
  body: {
    music: Playlist.Music
  }
}> => {
  const request = await fetch('/api/playlist/update-music', {
    method: 'POST',
    body: JSON.stringify({
      playlistId,
      musicId,
      type
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const statusCode = request.status
  const body = await request.json()
  return {
    status: statusCode,
    body
  }
}
