import { Socket } from 'socket.io-client'

export interface JamInfo {
  socket: Socket
  roomId: string
  ownerId: string
  allowCommandsByAll: boolean
  users: Array<{
    userId: string
    imageUrl: string
    name: string
  }>
}

export interface JamInfoProps extends JamInfo {
  onRoom: boolean
}