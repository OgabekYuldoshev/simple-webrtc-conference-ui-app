
import Chat from '@/components/Chat'
import Controller from '@/components/Controller'
import Main from '@/components/Main'
import Peers from '@/components/Peers'
import { RoomProvider } from '@/modules/context'
import { useParams } from 'react-router-dom'

export const RoomPage = () => {
  const { uuid } = useParams<{ uuid: string }>()

  return (
    <RoomProvider roomId={uuid!}>
      <div className='w-full min-h-screen grid grid-cols-4 grid-rows-7 gap-4 p-4'>
        <Peers />
        <Chat />
        <Main />
        <Controller />
      </div>
    </RoomProvider>
  )
}
