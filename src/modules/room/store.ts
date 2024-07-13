import { createStore, sample } from "effector";
import { IRoomStore } from "./type";
import { addNewPeerEvent, changeMicEvent, disableWebcamEvent, enableWebcamEvent, joinRoomEvent, leavePeerEvent, newProducerEvent, setProducerEvent } from "./events";
import { createRecvTransportFx, createSendTransportFx, createVideoProducerFx, getConsumerMediaFx, getConsumersMediaFx, joinRoomEventFx, loadRtpCapabilitiesFx } from "./effects";
import { Transport } from "mediasoup-client/lib/types";

export const $roomStore = createStore<IRoomStore>({
  roomId: '',
  local: {
    isCamera: false,
    isMic: false,
  },
  producers: {
    video: undefined,
    audio: undefined,
    share: undefined
  },
  consumers: {},
  peers: {},
  sendTransport: {} as Transport,
  recvTransport: {} as Transport,
  messages: [
    {
      uuid: 'h1',
      content: "Hello",
      isMe: true,
      createdAt: '12:23',
      author: 'Me'
    },
    {
      uuid: 'h2',
      content: "Hello, How are you?",
      isMe: false,
      createdAt: '12:23',
      author: 'Admin'
    }
  ]
})

$roomStore.on(joinRoomEvent, (state, { roomId }) => ({ ...state, roomId }))
$roomStore.on(setProducerEvent, (state, producer) => ({
  ...state, producers: {
    ...state.producers,
    [producer.id]: producer
  }
}))

$roomStore.on(createVideoProducerFx.doneData, (state, videoProducer) => ({
  ...state,
  local: {
    ...state.local,
    isCamera: true,
  },
  producers: {
    ...state.producers,
    video: videoProducer
  }
}))

$roomStore.on(disableWebcamEvent, (state) => {
  state.producers.video?.close()
  
  return {
    ...state,
    local: {
      ...state.local,
      isCamera: false,
    },
    producers: {
      ...state.producers,
      video: undefined
    }
  }
})
$roomStore.on(changeMicEvent, (state, value) => ({ ...state, local: { ...state.local, isMic: value } }))
$roomStore.on(createSendTransportFx.doneData, (state, sendTransport) => ({ ...state, sendTransport }))
$roomStore.on(createRecvTransportFx.doneData, (state, recvTransport) => ({ ...state, recvTransport }))
$roomStore.on(joinRoomEventFx.doneData, (state, { peers }) => ({
  ...state,
  peers: peers.reduce((acc, peer) => ({
    ...acc,
    [peer.peerId]: {
      peerId: peer.peerId,
      producers: peer.producers,
      consumers: []
    }
  }), {})
}))
$roomStore.on(addNewPeerEvent, (state, peer) => ({
  ...state,
  peers: {
    ...state.peers,
    [peer.peerId]: {
      peerId: peer.peerId,
      producers: peer.producers,
      consumers: []
    }
  }
}))

$roomStore.on(leavePeerEvent, (state, { peerId }) => {
  const peers = { ...state.peers }
  delete peers[peerId]

  return {
    ...state,
    peers
  }
})

$roomStore.on(getConsumersMediaFx.doneData, (state, consumers) => ({
  ...state,
  consumers
}))

$roomStore.on(getConsumerMediaFx.doneData, (state, consumer) => ({
  ...state,
  consumers: {
    ...state.consumers,
    [consumer.id]: consumer
  }
}))

sample({
  clock: joinRoomEvent,
  target: joinRoomEventFx
})

sample({
  clock: enableWebcamEvent,
  source: $roomStore,
  fn: ({ sendTransport }) => ({ sendTransport }),
  target: createVideoProducerFx
})

sample({
  clock: joinRoomEventFx.doneData,
  source: $roomStore,
  fn: (_, values) => ({
    routerRtpCapabilities: values.rtpCapabilities
  }),
  target: loadRtpCapabilitiesFx
})

sample({
  clock: loadRtpCapabilitiesFx.doneData,
  target: [createSendTransportFx, createRecvTransportFx]
})

sample({
  clock: newProducerEvent,
  source: $roomStore,
  fn: (state, newProducer) => ({
    recvTransport: state.recvTransport,
    peers: state.peers,
    newProducer
  }),
  target: getConsumerMediaFx
})

sample({
  clock: createRecvTransportFx.doneData,
  source: $roomStore,
  fn: (state, recvTransport) => ({ peers: state.peers, recvTransport }),
  target: getConsumersMediaFx
})