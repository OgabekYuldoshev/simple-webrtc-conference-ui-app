
import { Input } from "./ui/input"
import { useContext } from "react"
import { RoomContext } from "@/modules/context"

const Chat = () => {
  const { roomStore } = useContext(RoomContext)

  function handleSendMessage(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    console.log(e.target)
  }

  return (
    <div className="bg-zinc-900 rounded p-4 flex flex-col h-full col-span-1 row-span-12">
      <div className="flex flex-col gap-4 overflow-auto h-[85vh]">
        {
          roomStore.messages.map(message => {
            if (message.isMe) {
              return (
                <div key={message.uuid} className="flex flex-col w-fit bg-zinc-500 shadow p-2 rounded ml-auto">
                  <div className="flex justify-between mb-2">
                    <h1 className="text-sm">{message.author}</h1>
                    <span className="text-sm">{message.createdAt}</span>
                  </div>
                  <span className="text-sm">{message.content}</span>
                </div>
              )
            }
            return (
              <div key={message.uuid} className="flex flex-col w-fit bg-zinc-800 shadow p-2 rounded">
                <div className="flex justify-between text-white mb-2">
                  <h1 className="text-sm">{message.author}</h1>
                  <span className="text-sm">{message.createdAt}</span>
                </div>
                <span className="text-white text-sm">{message.content}</span>
              </div>
            )
          })
        }
      </div>
      {/* Chat input */}
      <div className="flex gap-2 mt-auto">
        <Input onKeyUp={handleSendMessage} placeholder="Write..." className="rounded" />
        {/* <Button size="icon" className="shrink-0">
          <Send size={18} />
        </Button> */}
      </div>
    </div>
  )
}

export default Chat