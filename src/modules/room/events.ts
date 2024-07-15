import { createEvent } from "effector";
import { Producer } from "mediasoup-client/lib/Producer";

export const joinRoomEvent = createEvent<{ roomId: string }>()

export const addNewPeerEvent = createEvent<{ peerId: string, producers: string[] }>()
export const newProducerEvent = createEvent<{ peerId: string, producerId: string }>()

export const leavePeerEvent = createEvent<{ peerId: string }>()

export const setProducerEvent = createEvent<Producer>()

export const enableWebcamEvent = createEvent()
export const disableWebcamEvent = createEvent()

export const enableMicEvent = createEvent()
export const disableMicEvent = createEvent()


export const changeMicEvent = createEvent<boolean>()

