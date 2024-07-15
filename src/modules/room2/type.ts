import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";

export interface IPeer {
  peerId: string;
  producers: string[];
  consumers: string[];
}

export interface IMessage {
  uuid: string
  content: string
  author: string
  createdAt: string
  isMe: boolean
}

export interface IRoomClientStore {
  peers: { [key: string]: IPeer }
  producers: { [key: string]: Producer }
  consumers: { [key: string]: Consumer }
  messages: IMessage[]
}