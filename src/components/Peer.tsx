import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface IProps {
  peerId: string
  videoTrack?: MediaStreamTrack | null
  audioTrack?: MediaStreamTrack | null
}

const Peer = ({ videoTrack, audioTrack }: IProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoTrack && videoRef.current) {
      const stream = new MediaStream([videoTrack])
      videoRef.current.srcObject = stream
    }
    if (audioTrack && audioRef.current) {
      const stream = new MediaStream([audioTrack])
      audioRef.current.srcObject = stream
    }
  }, [videoTrack, audioTrack])


  return (
    <div className="w-56 h-32 bg-zinc-800 shadow rounded shrink-0 relative overflow-hidden">
      <video ref={videoRef} className={cn(
        "absolute top-0 left-0 w-full h-full opacity-0 transition-all",
        videoTrack ? 'opacity-1' : ''
      )} playsInline autoPlay muted></video>
      <audio ref={audioRef} playsInline autoPlay></audio>
    </div>
  )
}

export default Peer