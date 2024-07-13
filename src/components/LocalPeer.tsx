import { RoomContext } from "@/modules/context"
import { useContext } from "react"
import Peer from "./Peer"

const LocalPeer = () => {
  const { roomStore } = useContext(RoomContext)
  const { audio, video } = roomStore.producers


  return <Peer peerId="local" audioTrack={audio?.track} videoTrack={video?.track} />
}

export default LocalPeer