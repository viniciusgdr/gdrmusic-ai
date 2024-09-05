export const deletePlaylist = async (playlistId: string): Promise<{
  status: number
}> => {
  const request = await fetch('/api/playlist/delete', {
    method: 'POST',
    body: JSON.stringify({
      playlistId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return {
    status: request.status
  }
}