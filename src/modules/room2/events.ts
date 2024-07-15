import { createEvent } from "effector";
import { IPeer } from "./type";
import { Producer } from "mediasoup-client/lib/Producer";
import { Consumer } from "mediasoup-client/lib/Consumer";
// Peers
export const addPeersListEvent = createEvent<Array<IPeer>>()

export const addPeerEvent = createEvent<IPeer>()
addPeerEvent.map(payload => {
  if (!payload.consumers) {
    payload.consumers = []
  }
  return payload
})

export const removePeerEvent = createEvent<{ peerId: string }>()
// Producers
export const addProducerEvent = createEvent<Producer>()
// Consumer
export const addConsumerEvent = createEvent<Consumer>()