import { Camera, ExternalLink, LogOut, Mic } from "lucide-react"
import { Button } from "./ui/button"
import room from "@/modules/room2/room"
// import { useContext } from "react"
// import { RoomContext } from "@/modules/context"
// import { disableMicEvent, disableWebcamEvent, enableMicEvent, enableWebcamEvent } from "@/modules/room/events"


const Controller = () => {
  // const { roomStore } = useContext(RoomContext)

  async function handleStreamViaWebCam() {
    room.enableWebCam()
  }

  // async function handleMicToggle() {
  //   if (!roomStore.local.isMic) {
  //     enableMicEvent()
  //   } else {
  //     disableMicEvent()
  //   }
  // }


  return (
    <div className="col-span-3 row-span-1 bg-zinc-900 rounded p-2 flex justify-center items-center gap-2">
      {/* Video */}
      <Button size="icon" className="rounded" onClick={handleStreamViaWebCam}>
        <Camera />
      </Button>
      {/* Muted */}
      <Button size="icon" className="rounded" >
        <Mic />
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