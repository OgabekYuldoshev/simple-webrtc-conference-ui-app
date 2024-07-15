import { RoomContext } from "@/modules/context"
import { useContext, useEffect, useState } from "react"
import Peer from "./Peer"
import { Producer } from "mediasoup-client/lib/types"

const LocalPeer = () => {
  const [videoProducer, setVideoProducer] = useState<Producer | undefined>(undefined)
  const [audioProducer, setAudioProducer] = useState<Producer | undefined>(undefined)

  const { roomStore } = useContext(RoomContext)
  useEffect(() => {
    const producers = Object.values(roomStore.producers)
    setVideoProducer(producers.find(p => p.kind === 'video'))
    setAudioProducer(producers.find(p => p.kind === "audio"))
  }, [roomStore.producers])

  return <Peer
    peerId="local"
    audioTrack={audioProducer ? audioProducer.track : null}
    videoTrack={videoProducer ? videoProducer.track : null}
    isMuted={true} />
}

export default LocalPeer