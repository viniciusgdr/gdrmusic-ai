import { Notify } from '@gdrmusic/components/Notify'
import { Queue } from '@gdrmusic/models/music'
export const deleteQueueMany = async (
  setQueue: React.Dispatch<React.SetStateAction<Queue[]>>
): Promise<{
  status: number
  data: Queue[]
}> => {
  const response = await fetch(`/api/queue/delete_nexts_queue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  if (response.status !== 200) {
    Notify('Ocorreu um erro ao adicionar a música na fila', 'Tente novamente mais tarde')
  } else {
    setQueue(data)
    Notify('Fila limpa', 'Sua fila foi limpa com sucesso')
  }
  return {
    status: response.status,
    data
  }
}
