import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { wsRequest } from "@/lib/ws"
import { useNavigate } from "react-router-dom"

export const HomePage = () => {
  const navigate = useNavigate()

  async function handleCreateRoom() {
    const room = await wsRequest<{ roomId: string }>("room:create", {})
    navigate(`/room/${room.roomId}`)
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="max-w-screen-md">
        <CardHeader>
          <CardTitle>Create new room</CardTitle>
          <CardDescription>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae, veritatis?</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button onClick={handleCreateRoom}>Create room</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
