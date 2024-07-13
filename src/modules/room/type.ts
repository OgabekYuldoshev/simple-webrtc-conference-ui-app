import { Consumer, Producer, Transport } from "mediasoup-client/lib/types";

export interface IMessage {
  uuid: string
  content: string
  author: string
  createdAt: string
  isMe: boolean
}

export interface IPeer {
  peerId: string
  producers: string[]
  consumers: string[]
}

export interface ILocal {
  isCamera: boolean;
  isMic: boolean;
}


export interface IRoomStore {
  roomId: string
  local: ILocal
  peers: {
    [peerId: string]: IPeer
  }
  producers: {
    video?: Producer
    audio?: Producer
    share?: Producer
  };
  consumers: {
    [consumerId: string]: Consumer
  };
  sendTransport: Transport
  recvTransport: Transport
  messages: IMessage[]
}