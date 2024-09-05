import { type Playlist } from '@gdrmusic/models/playlist'

export const createPlaylist = async (title?: string, thumbnailUrl?: string): Promise<{
  status: number
  response: Playlist
}> => {
  const request = await fetch('/api/playlist/create', {
    method: 'POST',
    body: JSON.stringify({
      title,
      thumbnailUrl
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const response = await request.json()
  return {
    status: request.status,
    response
  }
}