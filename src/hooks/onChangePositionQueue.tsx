import { Queue } from '@gdrmusic/models/music'

export const onChangePositionQueue = async ({
  setQueue,
  nexts,
}: {
  setQueue: React.Dispatch<React.SetStateAction<Queue[]>>
  nexts: Queue[]
}): Promise<{
  status: number
  response: Queue[]
}> => {
  const request = await fetch('/api/queue/position-nexts', {
    method: 'POST',
    body: JSON.stringify(nexts),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const response = await request.json()
  if (response.status === 200) {
    setQueue(response)
  }
  return {
    status: request.status,
    response
  }
}
