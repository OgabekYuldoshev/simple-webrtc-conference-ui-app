import { useContext } from 'react'
import Peer from './Peer'
import { RoomContext } from '@/modules/context'
import LocalPeer from './LocalPeer'
// import LocalPeer from './LocalPeer'

const Peers = () => {
  const { roomStore } = useContext(RoomContext)

  return (
    <div className='col-span-3 row-span-2 bg-zinc-900 p-2 rounded flex items-center gap-2 overflow-x-auto'>
      <LocalPeer />
      {
        Object.values(roomStore.peers).map(peer => {
          const consumerArray = peer.consumers.map(consumerId => roomStore.consumers[consumerId])
          const videoConsumer = consumerArray.find(consumer => consumer.kind === 'video')
          const audioConsumer = consumerArray.find(consumer => consumer.kind === "audio")

          return (
            <Peer
              key={peer.peerId}
              peerId={peer.peerId}
              audioTrack={audioConsumer ? audioConsumer.track : null}
              videoTrack={videoConsumer ? videoConsumer.track : null} />
          )
        })
      }
    </div>
  )
}

export default Peers