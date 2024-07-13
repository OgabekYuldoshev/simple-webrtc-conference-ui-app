import { Camera, CameraOff, ExternalLink, LogOut, Mic, MicOff } from "lucide-react"
import { Button } from "./ui/button"
import { useContext } from "react"
import { RoomContext } from "@/modules/context"
import { changeMicEvent, disableWebcamEvent, enableWebcamEvent } from "@/modules/room/events"


const Controller = () => {
  const { roomStore } = useContext(RoomContext)

  async function handleCameraToggle() {
    if (!roomStore.local.isCamera) {
      enableWebcamEvent()
    } else {
      disableWebcamEvent()
    }
  }

  return (
    <div className="col-span-3 row-span-1 bg-zinc-900 rounded p-2 flex justify-center items-center gap-2">
      {/* Video */}
      <Button size="icon" className="rounded" onClick={handleCameraToggle}>
        {roomStore.local.isCamera ? <CameraOff /> : <Camera />}
      </Button>
      {/* Muted */}
      <Button size="icon" className="rounded" onClick={() => changeMicEvent(!roomStore.local.isMic)} >
        {roomStore.local.isMic ? <MicOff /> : <Mic />}
      </Button>
      {/* ScreenShare */}
      <Button size="icon" className="rounded">
        <ExternalLink />
      </Button>
      {/* Leave */}
      <Button size="icon" variant="destructive" className="rounded">
        <LogOut />
      </Button>
    </div>
  )
}

export default Controller