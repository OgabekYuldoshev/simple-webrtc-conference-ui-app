import React, { useEffect } from 'react'
import { RoomContext } from './context'
import { IRoomContextValue } from './type'
import { $roomStore } from '../room/store'
import { addNewPeerEvent, joinRoomEvent, leavePeerEvent, newProducerEvent } from '../room/events'
import { useUnit } from 'effector-react'
import { ws } from '@/lib/ws'

interface IProps {
  roomId: string
  children: React.ReactNode
}

const Provider = ({ roomId, children }: IProps) => {
  const roomStore = useUnit($roomStore)
  useEffect(() => {
    joinRoomEvent({ roomId })
    ws.on("room:new_peer", addNewPeerEvent)
    ws.on("room:leave_peer", leavePeerEvent)
    ws.on("room:new_producer", newProducerEvent)

    return () => {
      ws.off("room:new_peer", addNewPeerEvent)
      ws.off("room:leave_peer", leavePeerEvent)
      ws.off("room:new_producer", newProducerEvent)
    }

  }, [roomId])

  const value = {
    roomStore
  } satisfies IRoomContextValue

  return (
    <RoomContext.Provider {...{ value }}>{children}</RoomContext.Provider>
  )
}

export default Provider