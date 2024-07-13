import { io } from "socket.io-client";
import { toast } from "sonner";

export const ws = io('http://localhost:81', {
  transports: ['websocket']
})

export const wsRequest = <T extends object>(path: string, payload: object) => {
  return new Promise<T>((res, rej) => {
    ws.emit(path, payload, (value: T) => {
      if ('error' in value) {
        toast.error(value.error as string)
        rej(value)
      }
      res(value)
    })
  })
}